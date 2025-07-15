# Pachinko Chat - Makefile for Docker operations

.PHONY: help dev prod build clean logs shell test lint

# Default target
help:
	@echo "Pachinko Chat - Docker Commands"
	@echo "==============================="
	@echo "make dev        - Start development environment with hot reload"
	@echo "make prod       - Build and run production version"
	@echo "make build      - Build all Docker images"
	@echo "make clean      - Stop and remove all containers"
	@echo "make logs       - Show logs from all containers"
	@echo "make shell      - Open shell in development container"
	@echo "make test       - Run tests in container"
	@echo "make lint       - Run linter in container"
	@echo "make models     - Pull Ollama models"
	@echo "make devcontainer - Open in VS Code devcontainer"

# Development environment
dev:
	@echo "🚀 Starting development environment..."
	docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ Development environment is running!"
	@echo "📍 App: http://localhost:5173"
	@echo "📍 Ollama: http://localhost:11434"

# Production build
prod:
	@echo "🏗️ Building production image..."
	docker-compose up -d pachinko-prod
	@echo "✅ Production server is running!"
	@echo "📍 App: http://localhost:3000"

# Build all images
build:
	@echo "🏗️ Building all Docker images..."
	docker-compose build --no-cache
	docker-compose -f docker-compose.dev.yml build --no-cache

# Clean up
clean:
	@echo "🧹 Stopping and removing containers..."
	docker-compose down -v
	docker-compose -f docker-compose.dev.yml down -v

# View logs
logs:
	docker-compose -f docker-compose.dev.yml logs -f

# Shell access
shell:
	docker-compose -f docker-compose.dev.yml exec pachinko bash

# Run tests
test:
	docker-compose -f docker-compose.dev.yml exec pachinko npm test

# Run linter
lint:
	docker-compose -f docker-compose.dev.yml exec pachinko npm run lint

# Pull Ollama models
models:
	@echo "📥 Pulling Ollama models..."
	docker-compose -f docker-compose.dev.yml run --rm model-loader

# Open in devcontainer
devcontainer:
	@echo "🚀 Opening in VS Code devcontainer..."
	code --folder-uri vscode-remote://dev-container+$$(pwd | xxd -p)/workspace

# Development with watch
watch:
	@echo "👀 Starting development with file watching..."
	docker-compose -f docker-compose.dev.yml up

# Stop all services
stop:
	docker-compose -f docker-compose.dev.yml stop
	docker-compose stop

# Restart services
restart: stop dev

# Check service health
health:
	@echo "🏥 Checking service health..."
	@docker-compose -f docker-compose.dev.yml ps
	@echo ""
	@echo "Ollama status:"
	@curl -s http://localhost:11434/ || echo "❌ Ollama is not responding"
	@echo ""
	@echo "Available models:"
	@docker-compose -f docker-compose.dev.yml exec ollama ollama list || echo "❌ Cannot list models"