# API Dockerfile for ScripTeam
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base AS development
WORKDIR /app

# Copy all package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared/package*.json ./packages/shared/

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

# Set working directory to API
WORKDIR /app/apps/api

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]

# Production builder
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules

# Copy source code
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

# Set working directory to API
WORKDIR /app/apps/api

# Build the application
RUN npm run build

# Production runner
FROM base AS production
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package*.json ./apps/api/

# Set working directory to API
WORKDIR /app/apps/api

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]