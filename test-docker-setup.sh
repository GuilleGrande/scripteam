#!/bin/bash

echo "🚀 Testing ScripTeam Docker Setup"
echo "================================="

# Stop any existing containers
echo "📦 Stopping existing containers..."
docker-compose down --remove-orphans

# Clean up dangling images and volumes if needed
echo "🧹 Cleaning up..."
docker system prune -f

# Build and start services
echo "🏗️ Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏱️ Waiting for services to start..."
sleep 30

# Check service health
echo "🏥 Checking service health..."
echo "Database:"
docker-compose ps postgres
echo ""

echo "Redis:"
docker-compose ps redis
echo ""

echo "API:"
docker-compose ps api
echo ""

echo "Web:"
docker-compose ps web
echo ""

# Test API health endpoint
echo "🔍 Testing API health endpoint..."
curl -f http://localhost:3001/health || echo "❌ API health check failed"
echo ""

# Test web app accessibility
echo "🌐 Testing web app accessibility..."
curl -f http://localhost:5173 || echo "❌ Web app not accessible"
echo ""

echo "✅ Docker setup test complete!"
echo ""
echo "Access points:"
echo "- Web App: http://localhost:5173"
echo "- API Test Page: http://localhost:5173/api-test"
echo "- API Health: http://localhost:3001/health"
echo "- PostgreSQL: localhost:5432"
echo "- Redis: localhost:6379"
echo ""
echo "To stop services: docker-compose down"