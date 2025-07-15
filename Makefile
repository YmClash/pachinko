# Pachinko Chat - Makefile for Docker operations

.PHONY: help dev prod build clean logs shell test lint check-docker

# Detect docker compose command
DOCKER_COMPOSE := $(shell docker compose version > /dev/null 2>&1 && echo "docker compose" || echo "docker-compose")

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
	@echo "make check-docker - Check Docker installation"

# Check Docker installation
check-docker:
	@echo "🔍 Checking Docker installation..."
	@docker --version || (echo "❌ Docker is not installed" && exit 1)
	@echo "✅ Docker is installed"
	@echo "🔍 Checking Docker Compose..."
	@$(DOCKER_COMPOSE) version || (echo "❌ Docker Compose is not installed" && exit 1)
	@echo "✅ Docker Compose is installed"
	@echo "🔍 Checking Docker daemon..."
	@docker ps > /dev/null 2>&1 || (echo "❌ Docker daemon is not running. Please start Docker Desktop." && exit 1)
	@echo "✅ Docker daemon is running"

# Development environment
dev: check-docker
	@echo "🚀 Starting development environment..."
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml up -d
	@echo "✅ Development environment is running!"
	@echo "📍 App: http://localhost:5173"
	@echo "📍 Ollama: http://localhost:11434"

# Production build
prod: check-docker
	@echo "🏗️ Building production image..."
	$(DOCKER_COMPOSE) up -d pachinko-prod
	@echo "✅ Production server is running!"
	@echo "📍 App: http://localhost:3000"

# Build all images
build: check-docker
	@echo "🏗️ Building all Docker images..."
	$(DOCKER_COMPOSE) build --no-cache
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml build --no-cache

# Clean up
clean:
	@echo "🧹 Stopping and removing containers..."
	$(DOCKER_COMPOSE) down -v
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml down -v

# View logs
logs:
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml logs -f

# Shell access
shell:
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml exec pachinko bash

# Run tests
test:
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml exec pachinko npm test

# Run linter
lint:
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml exec pachinko npm run lint

# Pull Ollama models
models:
	@echo "📥 Pulling Ollama models..."
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml run --rm model-loader

# Open in devcontainer
devcontainer:
	@echo "🚀 Opening in VS Code devcontainer..."
	code --folder-uri vscode-remote://dev-container+$$(pwd | xxd -p)/workspace

# Development with watch
watch: check-docker
	@echo "👀 Starting development with file watching..."
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml up

# Stop all services
stop:
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml stop
	$(DOCKER_COMPOSE) stop

# Restart services
restart: stop dev

# Check service health
health:
	@echo "🏥 Checking service health..."
	@$(DOCKER_COMPOSE) -f docker-compose.dev.yml ps
	@echo ""
	@echo "Ollama status:"
	@curl -s http://localhost:11434/ || echo "❌ Ollama is not responding"
	@echo ""
	@echo "Available models:"
	@$(DOCKER_COMPOSE) -f docker-compose.dev.yml exec ollama ollama list || echo "❌ Cannot list models"

# Alternative for Codespaces - run without Docker
dev-local:
	@echo "🚀 Starting local development (no Docker)..."
	@echo "📦 Installing dependencies..."
	npm install
	@echo "🔧 Starting Ollama in background..."
	@echo "⚠️  Note: You need to install Ollama separately on Codespaces"
	@echo "Run: curl -fsSL https://ollama.com/install.sh | sh"
	@echo ""
	@echo "🎮 Starting development server..."
	npm run dev