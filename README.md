# 🎰 Pachinko Ollama Chat

A futuristic chat interface with Pachinko-inspired 3D animations, neon aesthetics, and real-time AI streaming powered by Ollama.

![Pachinko Chat](https://img.shields.io/badge/Status-Beta-yellow)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18.3-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.178-green)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-181717)

## ✨ Features

- 🤖 **Real-time AI Chat** - Stream responses from multiple Ollama models
- 🎨 **Neon Cyberpunk UI** - Glowing effects, animations, and custom components
- 🎰 **3D Pachinko Physics** - Interactive ball-drop animations with Three.js
- 💾 **Persistent Storage** - IndexedDB with localStorage fallback
- 🎵 **Sound Effects** - Immersive audio feedback (optional)
- 🌈 **Customizable** - Toggle effects, change models, adjust settings
- 📱 **Responsive** - Works on desktop and mobile devices
- 🔄 **Auto-reconnect** - Automatic recovery from connection issues
- 🐳 **Docker Support** - Run anywhere with containers

## 🚀 Quick Start

### 🎯 One-Click Installation

The fastest way to get started:

#### Windows
```bash
start-pachinko.bat
```

#### Linux/macOS/WSL
```bash
./start-pachinko.sh
```

These scripts will automatically:
- ✅ Check prerequisites
- ✅ Install Ollama (if needed)
- ✅ Download AI models
- ✅ Install dependencies
- ✅ Launch the application

**📖 See [QUICKSTART.md](./QUICKSTART.md) for detailed instructions**

## 🐳 Docker Deployment

### Quick Docker Start
```bash
# Development with hot reload
make dev

# Production build
make prod
```

### VS Code DevContainer
1. Open project in VS Code
2. Press `F1` → "Dev Containers: Reopen in Container"
3. Everything is automatically configured!

**📖 See [DOCKER.md](./DOCKER.md) for complete Docker documentation**

## 🛠️ Manual Installation

### Prerequisites

- Node.js 18+ and npm
- [Ollama](https://ollama.ai/) installed and running
- At least one Ollama model

### Installation Steps

```bash
# Clone the repository
git clone https://github.com/yourusername/pachinko.git
cd pachinko

# Install dependencies
npm install

# Start Ollama (in a separate terminal)
ollama serve

# Pull AI models
ollama pull qwen2:7b
ollama pull gemma2:9b
ollama pull llama3.2:latest

# Run the development server
npm run dev
```

Open http://localhost:5173 in your browser.

## 💻 Development

### Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Docker commands
make dev            # Start Docker development
make prod           # Run production build
make test           # Run tests in container
make logs           # View container logs
make shell          # Open shell in container
```

### Project Structure

```
src/
├── components/      # React components
│   ├── Chat/       # Chat interface components
│   ├── Layout/     # Layout components (Header, Sidebar)
│   ├── Pachinko/   # 3D Pachinko components
│   └── UI/         # Reusable UI components
├── hooks/          # Custom React hooks
├── services/       # API and storage services
├── store/          # Zustand state management
├── styles/         # Global styles and themes
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## 🚀 Deployment Options

### 1. Local Deployment
Use the quick start scripts above for local deployment.

### 2. Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or use the Makefile
make prod
```

### 3. Cloud Deployment

#### Deploy to Cloud Run (Google Cloud)
```bash
# Build and push image
docker build -t gcr.io/your-project/pachinko-chat .
docker push gcr.io/your-project/pachinko-chat

# Deploy
gcloud run deploy pachinko-chat \
  --image gcr.io/your-project/pachinko-chat \
  --platform managed \
  --allow-unauthenticated
```

#### Deploy to Azure Container Instances
```bash
# Create container instance
az container create \
  --resource-group myResourceGroup \
  --name pachinko-chat \
  --image your-registry/pachinko-chat:latest \
  --ports 3000 \
  --dns-name-label pachinko-chat
```

## 🎨 Customization

### Theme Colors

Edit the neon color palette in `tailwind.config.js`:

```javascript
colors: {
  neon: {
    pink: '#ff006e',
    blue: '#3a86ff',
    purple: '#8338ec',
    green: '#06ffa5',
    yellow: '#ffbe0b',
  }
}
```

### Environment Variables

Create a `.env` file:

```bash
VITE_OLLAMA_URL=http://localhost:11434
VITE_DEFAULT_MODEL=qwen2:7b
VITE_ENABLE_SOUNDS=true
VITE_ENABLE_3D=true
```

### Sound Effects

Add your own sound files to `public/sounds/`:
- `ball-drop.mp3` - Ball collision sound
- `win.mp3` - Success sound
- `message.mp3` - Message sent sound
- `click.mp3` - UI click sound
- `error.mp3` - Error sound

## 🐛 Troubleshooting

### Ollama Connection Issues

1. **Ensure Ollama is running:**
   ```bash
   ollama serve
   ```

2. **Check installed models:**
   ```bash
   ollama list
   ```

3. **Verify connection:**
   ```bash
   curl http://localhost:11434/api/tags
   ```

4. **WSL2 Users:** Make sure you're using the Windows Ollama instance, not WSL's

### Performance Issues

- Disable 3D effects in Settings
- Reduce particle count in `PachinkoBackground.tsx`
- Use Chrome/Edge for best WebGL performance

### Docker Issues

See [DOCKER.md](./DOCKER.md#-troubleshooting) for Docker-specific troubleshooting.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📦 Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **UI/UX:** Tailwind CSS, Framer Motion
- **3D Graphics:** Three.js, React Three Fiber
- **State:** Zustand with Immer
- **AI Backend:** Ollama
- **Storage:** IndexedDB, LocalStorage
- **DevOps:** Docker, GitHub Actions

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai/) for the AI backend
- [Three.js](https://threejs.org/) for 3D graphics
- [Framer Motion](https://www.framer.com/motion/) for animations
- Inspired by Japanese Pachinko machines 🎰

## 🔗 Links

- [Quick Start Guide](./QUICKSTART.md)
- [Docker Documentation](./DOCKER.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [API Documentation](./docs/API.md) *(coming soon)*
- [Contributing Guide](./CONTRIBUTING.md) *(coming soon)*

---

Made with 💜 by the Pachinko Chat Team