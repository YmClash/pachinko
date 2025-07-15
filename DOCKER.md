# 🐳 Pachinko Chat - Docker Guide

## 📋 Prerequisites

- Docker Desktop or Docker Engine
- Docker Compose v2+
- (Optional) VS Code with Dev Containers extension
- (Optional) NVIDIA GPU + drivers for GPU acceleration

## 🚀 Quick Start

### Using Make commands (Recommended)
```bash
# Start development environment
make dev

# View logs
make logs

# Stop everything
make clean
```

### Using Docker Compose directly
```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# Stop all services
docker-compose -f docker-compose.dev.yml down
```

## 🏗️ Available Configurations

### 1. Development Environment (`docker-compose.dev.yml`)
Full development setup with:
- ✅ Hot reload
- ✅ Ollama service with auto model pulling
- ✅ Volume mounts for code changes
- ✅ GPU support (if available)

```bash
docker-compose -f docker-compose.dev.yml up
```

### 2. Production Build (`docker-compose.yml`)
Optimized production setup:
- ✅ Multi-stage build
- ✅ Minimal image size
- ✅ Health checks
- ✅ Restart policies

```bash
docker-compose --profile production up
```

### 3. VS Code Dev Container
Full IDE integration:
- ✅ Pre-configured extensions
- ✅ Integrated terminal
- ✅ Debugging support
- ✅ Git integration

```bash
# Open in VS Code
code .
# Then: F1 -> "Dev Containers: Reopen in Container"
```

## 🛠️ Makefile Commands

| Command | Description |
|---------|-------------|
| `make dev` | Start development environment |
| `make prod` | Build and run production |
| `make build` | Build all Docker images |
| `make clean` | Stop and remove containers |
| `make logs` | Show container logs |
| `make shell` | Open shell in dev container |
| `make test` | Run tests |
| `make lint` | Run linter |
| `make models` | Pull Ollama models |
| `make health` | Check service health |

## 📦 Docker Images

### Base Images Used
- `node:20-alpine` - Production Node.js
- `node:20` - Development Node.js
- `ollama/ollama:latest` - Ollama AI service
- `mcr.microsoft.com/devcontainers/typescript-node:20` - Dev container

### Built Images
- `pachinko-chat:development` - Dev environment with tools
- `pachinko-chat:production` - Optimized production build

## 🔧 Configuration

### Environment Variables
```bash
# Ollama configuration
VITE_OLLAMA_URL=http://ollama:11434
VITE_DEFAULT_MODEL=qwen2:7b

# Feature flags
VITE_ENABLE_SOUNDS=true
VITE_ENABLE_3D=true

# Development
NODE_ENV=development
```

### Volumes
- `ollama-models` - Persistent Ollama model storage
- `./:/workspace` - Code mounting for development

### Networks
- `pachinko-network` - Internal bridge network

## 🚨 Troubleshooting

### Ollama Connection Issues
```bash
# Check Ollama service
docker-compose -f docker-compose.dev.yml logs ollama

# Test Ollama endpoint
curl http://localhost:11434/
```

### GPU Support (NVIDIA)
```bash
# Check NVIDIA runtime
docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi

# Enable GPU in compose
# Already configured in docker-compose.dev.yml
```

### Permission Issues
```bash
# Fix ownership
sudo chown -R $USER:$USER .

# Reset volumes
docker-compose down -v
```

### Port Conflicts
```bash
# Check port usage
sudo lsof -i :5173
sudo lsof -i :11434

# Use different ports
VITE_PORT=3001 docker-compose up
```

## 🏃 Development Workflow

1. **Start services**
   ```bash
   make dev
   ```

2. **Make code changes**
   - Changes auto-reload via Vite HMR
   - No container restart needed

3. **View logs**
   ```bash
   make logs
   ```

4. **Run tests**
   ```bash
   make test
   ```

5. **Clean up**
   ```bash
   make clean
   ```

## 🚀 Production Deployment

### Build production image
```bash
docker build -t pachinko-chat:latest .
```

### Run with external Ollama
```bash
docker run -d \
  -p 3000:3000 \
  -e VITE_OLLAMA_URL=http://your-ollama-host:11434 \
  pachinko-chat:latest
```

### Deploy to cloud
```bash
# Tag for registry
docker tag pachinko-chat:latest your-registry/pachinko-chat:latest

# Push to registry
docker push your-registry/pachinko-chat:latest
```

## 📝 Notes

- Models are downloaded on first run (~5-10GB)
- Development container includes all build tools
- Production image is ~50MB (excluding models)
- GPU acceleration requires NVIDIA Docker runtime