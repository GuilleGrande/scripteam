# Docker Architecture

ScripTeam leverages Docker containerization for development/production parity, reliable deployments, and service isolation while maintaining the cost-effective Hostinger VPS approach:

## Container Strategy

**Development Benefits:**
- `docker-compose up` creates identical environment locally
- No more "works on my machine" deployment issues
- Isolated services with proper resource allocation
- Easy database resets and workflow testing

**Production Benefits:**
- One-command deployment with zero-downtime updates
- Container health checks and automatic restarts
- Resource limits prevent service interference
- Volume persistence for data and AI models

## Docker Compose Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  # API Gateway Container
  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    container_name: scripteam-api
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/scripteam
      - REDIS_URL=redis://redis:6379
      - N8N_BASE_URL=http://n8n:5678
      - GPT_OSS_URL=http://gpt-oss:8080
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      n8n:
        condition: service_started
    volumes:
      - upload_data:/app/uploads
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'

  # n8n Workflow Engine Container
  n8n:
    image: n8nio/n8n:latest
    container_name: scripteam-n8n
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=postgres
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_AUTH_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_AUTH_PASSWORD}
      - WEBHOOK_URL=https://api.scripteam.com
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - n8n_data:/home/node/.n8n
      - ./n8n-workflows:/import:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5678/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '2.0'

  # GPT-OSS AI Processing Container
  gpt-oss:
    build:
      context: ./infrastructure/gpt-oss
      dockerfile: Dockerfile
    container_name: scripteam-gpt-oss
    environment:
      - MODEL_PATH=/models/gpt-oss
      - MAX_TOKENS=2048
      - TEMPERATURE=0.7
      - WORKERS=2
    volumes:
      - gpt_models:/models
      - gpt_cache:/cache
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 60s
      timeout: 30s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 16G
          cpus: '8.0'
        reservations:
          memory: 8G
          cpus: '4.0'

  # PostgreSQL Database Container
  postgres:
    image: postgres:15-alpine
    container_name: scripteam-postgres
    environment:
      - POSTGRES_DB=scripteam
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_INITDB_ARGS=--encoding=UTF-8 --lc-collate=C --lc-ctype=C
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./apps/api/database/init.sql:/docker-entrypoint-initdb.d/01-init.sql
      - ./apps/api/database/extensions.sql:/docker-entrypoint-initdb.d/02-extensions.sql
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d scripteam"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: '2.0'

  # Redis Cache Container
  redis:
    image: redis:7-alpine
    container_name: scripteam-redis
    volumes:
      - redis_data:/data
      - ./infrastructure/redis/redis.conf:/etc/redis/redis.conf
    command: redis-server /etc/redis/redis.conf
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'

  # Nginx Reverse Proxy Container
  nginx:
    image: nginx:alpine
    container_name: scripteam-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infrastructure/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./infrastructure/nginx/ssl:/etc/nginx/ssl:ro
      - upload_data:/var/www/uploads:ro
      - ./infrastructure/nginx/logs:/var/log/nginx
    depends_on:
      api:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  n8n_data:
    driver: local
  gpt_models:
    driver: local
  gpt_cache:
    driver: local
  upload_data:
    driver: local

networks:
  default:
    name: scripteam_network
    driver: bridge
```

## Container Specifications

### API Container (Node.js)

```dockerfile
# apps/api/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Build application
RUN npm run build

FROM node:18-alpine AS runtime

WORKDIR /app

# Install production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/packages/shared ./packages/shared

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S scripteam -u 1001

# Create directories and set permissions
RUN mkdir -p /app/uploads /app/logs && \
    chown -R scripteam:nodejs /app

USER scripteam

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "dist/server.js"]
```

### GPT-OSS Container

```dockerfile
# infrastructure/gpt-oss/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/
COPY models/ ./models/

# Create non-root user
RUN adduser --disabled-password --gecos '' --uid 1001 scripteam

# Create directories and set permissions
RUN mkdir -p /models /cache && \
    chown -R scripteam:scripteam /app /models /cache

USER scripteam

EXPOSE 8080

HEALTHCHECK --interval=60s --timeout=30s --start-period=120s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["python", "src/server.py"]
```

## Container Network Architecture

```mermaid
graph TB
    subgraph "Docker Host - Hostinger VPS"
        subgraph "scripteam_network (bridge)"
            subgraph "External Access"
                NX[nginx:443/80<br/>Reverse Proxy]
            end

            subgraph "Application Layer"
                API[api:3000<br/>Node.js API]
                N8N[n8n:5678<br/>Workflow Engine]
            end

            subgraph "AI Processing"
                GPT[gpt-oss:8080<br/>AI Analysis]
            end

            subgraph "Data Layer"
                PG[postgres:5432<br/>Database]
                RD[redis:6379<br/>Cache]
            end
        end

        subgraph "Docker Volumes"
            V1[postgres_data]
            V2[n8n_data]
            V3[gpt_models]
            V4[upload_data]
            V5[redis_data]
        end
    end

    NX --> API
    NX --> N8N
    API --> PG
    API --> RD
    API --> N8N
    N8N --> GPT
    N8N --> PG

    PG -.-> V1
    N8N -.-> V2
    GPT -.-> V3
    API -.-> V4
    RD -.-> V5

    style NX fill:#f1f8e9
    style API fill:#e3f2fd
    style N8N fill:#e1f5fe
    style GPT fill:#f3e5f5
    style PG fill:#fff3e0
    style RD fill:#ffebee
```

## Resource Allocation Strategy

**Hostinger VPS (12 cores, 32GB RAM) Resource Distribution:**

| Container | CPU Limit | Memory Limit | Purpose |
|-----------|-----------|--------------|---------|
| GPT-OSS | 8 cores | 16GB | AI model inference requires most resources |
| PostgreSQL | 2 cores | 4GB | Database with sufficient memory for caching |
| n8n | 2 cores | 2GB | Workflow orchestration with moderate needs |
| API | 1 core | 1GB | Lightweight Node.js application |
| Redis | 0.5 cores | 1GB | Fast cache with minimal CPU needs |
| Nginx | 0.5 cores | 512MB | Reverse proxy with minimal overhead |
| **Total** | **14 cores** | **24.5GB** | **Buffer for system overhead** |

## Development Workflow Integration

### Local Development

```bash
# Development environment with hot reload
# docker-compose.dev.yml
version: '3.8'

services:
  api:
    build:
      context: ./apps/api
      target: development
    volumes:
      - ./apps/api:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev

  # Mock GPT-OSS for faster local development
  gpt-oss-mock:
    image: wiremock/wiremock:latest
    ports:
      - "8080:8080"
    volumes:
      - ./infrastructure/mocks:/home/wiremock
```

### Production Deployment

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "🚀 Starting ScripTeam deployment..."

# Pull latest changes
git pull origin main

# Build and start containers
docker-compose down
docker-compose pull
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
docker-compose exec api npm run health-check
docker-compose exec postgres pg_isready -U postgres

# Run database migrations
echo "📊 Running database migrations..."
docker-compose exec api npm run db:migrate

# Import n8n workflows
echo "🔄 Importing n8n workflows..."
docker-compose exec n8n n8n import:workflow --input=/import

# Verify deployment
echo "✅ Verifying deployment..."
curl -f https://api.scripteam.com/health || exit 1

echo "🎉 Deployment completed successfully!"
```

## File Storage & CDN Component

**Responsibility:** Secure storage and global delivery of audio files, scripts, and character avatars

**Key Interfaces:**
- Audio file upload and compression for voice samples
- Script PDF and text file storage with encryption
- Character avatar image storage and optimization
- CDN distribution for low-latency global access

**Dependencies:** Hostinger storage infrastructure, CDN network

**Technology Stack:** Hostinger file storage, CDN integration, file compression, security encryption

## Component Diagrams

```mermaid
graph TB
    subgraph "Mobile Application"
        MA[React Native App]
        MS[Zustand State]
        MC[Audio Cache]
    end

    subgraph "API Layer"
        AG[API Gateway]
        AU[Auth0]
    end

    subgraph "AI Processing Pipeline"
        N8N[n8n Workflows]
        GPT[GPT-OSS]
        EL[ElevenLabs API]
        PH[Play.HT API]
    end

    subgraph "Data Layer"
        PG[PostgreSQL]
        RD[Redis Cache]
        FS[File Storage]
        CDN[Hostinger CDN]
    end

    MA -->|REST API| AG
    AG -->|User Auth| AU
    AG -->|Trigger Workflows| N8N
    AG -->|Data Queries| PG
    AG -->|Session Cache| RD

    N8N -->|Script Analysis| GPT
    N8N -->|Voice Generation| EL
    N8N -->|Backup Voice| PH
    N8N -->|Store Results| PG
    N8N -->|Cache Audio| FS

    FS -->|Global Delivery| CDN
    CDN -->|Audio Files| MC

    MS -->|Local State| MA
    MC -->|Offline Practice| MA

    style N8N fill:#e1f5fe
    style GPT fill:#f3e5f5
    style EL fill:#fff3e0
    style PH fill:#fff3e0
```
