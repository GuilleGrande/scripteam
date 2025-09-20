# 🎭 ScripTeam POC

AI-powered acting practice platform with Spanish/English language support

**Live Demo**: https://scripteam.bigapps.dev
**API Docs**: https://api.scripteam.bigapps.dev
**n8n Workflows**: https://n8n.scripteam.bigapps.dev

## 🏗️ Architecture

This is a **monorepo** containing:

- **`apps/web/`** - React web app (Vite + ShadCN/UI)
- **`apps/api/`** - Express.js backend API (future)
- **`apps/mobile/`** - React Native mobile app (future)
- **`packages/shared/`** - Shared TypeScript types and utilities

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start web app
npm run dev:web

# Start with Docker (full stack)
docker-compose up -d postgres redis n8n
npm run dev:web
```

### Production Deployment

```bash
# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 Project Structure

```
scripteam-poc/
├── apps/
│   ├── web/                    # React web app
│   ├── api/                    # Express.js backend (future)
│   └── mobile/                 # React Native app (future)
├── packages/
│   └── shared/                 # Shared TypeScript types
├── .github/workflows/          # CI/CD pipelines
├── nginx/                      # Reverse proxy config
├── docker-compose.yml          # Development environment
├── docker-compose.prod.yml     # Production environment
└── docs/                       # Architecture & stories
```

## 🌐 Subdomains (bigapps.dev)

- **Main App**: https://scripteam.bigapps.dev
- **API**: https://api.scripteam.bigapps.dev
- **n8n Workflows**: https://n8n.scripteam.bigapps.dev
- **CDN Assets**: https://cdn.scripteam.bigapps.dev
- **Staging**: https://staging.scripteam.bigapps.dev

## 🔧 Environment Setup

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Configure your values**:
   ```bash
   # Required for local development
   POSTGRES_PASSWORD=your_password
   N8N_AUTH_PASSWORD=your_n8n_password
   JWT_SECRET=your_jwt_secret

   # Required for production
   ELEVENLABS_API_KEY=your_key
   PLAYHT_API_KEY=your_key
   ```

3. **SSL Certificates** (production):
   - Add your SSL certificates to `nginx/ssl/`
   - Update nginx configuration as needed

## 🧪 Available Scripts

### Root Level
- `npm run dev` - Start web app
- `npm run build` - Build all workspaces
- `npm run test` - Run tests in all workspaces
- `npm run lint` - Lint all workspaces
- `npm run typecheck` - Type check all workspaces

### Web App
- `npm run dev:web` - Start web development server
- `npm run build --workspace=apps/web` - Build web app
- `npm run preview --workspace=apps/web` - Preview production build

### Shared Package
- `npm run build --workspace=packages/shared` - Build shared types
- `npm run dev --workspace=packages/shared` - Watch mode for shared types

## 🐳 Docker Services

### Development
```bash
# Start core services
docker-compose up -d postgres redis n8n

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production
```bash
# Full production deployment
docker-compose -f docker-compose.prod.yml up -d

# Update production
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d --remove-orphans
```

## 🚀 CI/CD Pipeline

**GitHub Actions workflows**:

- **Web Deploy** (`web-deploy.yml`) - Builds and deploys web app
- **API Deploy** (`api-deploy.yml`) - Builds and deploys API containers
- **Shared Validation** (`shared-validation.yml`) - Validates shared types

**Deployment Strategy**:
- `develop` branch → Staging environment
- `main` branch → Production environment
- Manual approval required for production

## 📋 Current Status

### ✅ Completed
- [x] Monorepo structure with workspaces
- [x] React web app with ShadCN/UI
- [x] Shared TypeScript types package
- [x] Docker development environment
- [x] GitHub Actions CI/CD pipelines
- [x] Nginx reverse proxy configuration
- [x] Domain setup for bigapps.dev

### 🚧 In Progress
- [ ] Express.js API backend
- [ ] PostgreSQL database schema
- [ ] File upload and processing
- [ ] AI workflow integration

### 📋 Planned
- [ ] React Native mobile app
- [ ] n8n workflow implementation
- [ ] GPT-OSS integration
- [ ] ElevenLabs voice synthesis
- [ ] User authentication (Auth0)

## 🏃‍♂️ Story Development

This project follows **BMAD Core** story-driven development:

- **Current Story**: [1.1 Basic Script Upload](docs/stories/1.1.basic-script-upload-and-text-processing.md)
- **Architecture**: [docs/architecture/](docs/architecture/)
- **PRD**: [docs/prd/](docs/prd/)

## 🔐 Security

- **Environment variables** stored in `.env` (never committed)
- **SSL/TLS encryption** in production
- **Rate limiting** on API endpoints
- **CORS configuration** for web app
- **Basic auth** for n8n workflow engine

## 📊 Monitoring

- **Error tracking**: Sentry integration
- **Logs**: Structured logging with Winston
- **Health checks**: `/health` endpoints for all services
- **Metrics**: Container resource monitoring

## 🤝 Contributing

1. **Create feature branch**: `git checkout -b feature/your-feature`
2. **Follow story development**: Use existing stories or create new ones
3. **Run tests**: `npm run test`
4. **Submit PR**: Target `develop` branch

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Built with** ❤️ **using BMAD Core story-driven development**