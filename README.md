# 🎭 ScripTeam

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

### Development with Docker (Recommended)

```bash
# Start full stack (PostgreSQL + Redis + API + Web)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Run comprehensive test
./test-docker-setup.sh
```

**Access Points:**
- Web App: http://localhost:5173
- API Test Page: http://localhost:5173/api-test
- API Health: http://localhost:3001/health
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Local Development (Alternative)

```bash
# Install dependencies
npm install

# Start API backend
npm run dev:api

# Start web app (in another terminal)
npm run dev:web
```

## 📁 Project Structure

```
scripteam/
├── apps/
│   ├── web/                    # React web app (Vite + ShadCN/UI)
│   └── api/                    # Express.js backend (complete)
├── packages/
│   └── shared/                 # Shared TypeScript types
├── docs/
│   ├── architecture/           # Technical documentation
│   ├── stories/                # Story-driven development
│   └── qa/                     # Quality assurance
├── docker-compose.yml          # Full-stack development
├── test-docker-setup.sh        # Comprehensive testing
└── .github/workflows/          # CI/CD pipelines
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

### ✅ Completed (Ready for Development)
- [x] **Full-stack architecture** with Docker orchestration
- [x] **React web app** with ShadCN/UI from Lovable PoC
- [x] **Express.js API backend** with complete functionality
- [x] **Script upload and PDF processing** (Story 1.1)
- [x] **PostgreSQL database** schema with graceful fallback
- [x] **File storage and validation** system with security
- [x] **Docker development environment** with hot reloading
- [x] **API connectivity** verified between web ↔ API services
- [x] **Complete UI workflow**: Upload → Character Selection → Practice
- [x] **Testing infrastructure** with automated setup scripts

### 🎯 Ready to Implement (Stories 2.2-2.5)
- [ ] **Script analysis and character detection** (Story 2.2)
- [ ] **Voice synthesis integration** ElevenLabs/PlayHT (Story 2.3)
- [ ] **Interactive practice sessions** with AI voices (Story 2.4)
- [ ] **Quick response and feedback** system (Story 2.5)

### 🚀 Next Development Phase
- [ ] Character personality analysis from script text
- [ ] Voice API integration with character mapping
- [ ] Real-time practice session engine
- [ ] Performance feedback and progress tracking

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