# 🚀 Pachinko Chat - Quick Start Guide

## 🎯 One-Command Setup & Launch

### 🪟 Windows
```bash
start-pachinko.bat
```

### 🐧 Linux/macOS/WSL
```bash
./start-pachinko.sh
```

## 📋 What the Scripts Do

1. **Check Prerequisites**
   - ✅ Node.js v18+ and npm
   - ✅ Ollama installation

2. **Install Dependencies**
   - 📦 npm packages (if not already installed)

3. **Setup Ollama**
   - 🤖 Install Ollama (Linux/macOS only)
   - 🚀 Start Ollama service
   - 📥 Download AI models:
     - qwen2:7b
     - gemma2:9b
     - llama3.2:latest

4. **Launch Pachinko**
   - 🌐 Open browser at http://localhost:5173
   - 🔥 Start development server

## 🛠️ Manual Setup (Alternative)

If you prefer manual setup:

### 1. Install Ollama
- **Windows**: Download from [ollama.com/download/windows](https://ollama.com/download/windows)
- **macOS**: `brew install ollama` or download from [ollama.com](https://ollama.com)
- **Linux**: `curl -fsSL https://ollama.com/install.sh | sh`

### 2. Start Ollama Service
```bash
ollama serve
```

### 3. Pull AI Models
```bash
ollama pull qwen2:7b
ollama pull gemma2:9b
ollama pull llama3.2:latest
```

### 4. Install Dependencies & Run
```bash
npm install
npm run dev
```

## 🔧 Troubleshooting

### Ollama Connection Issues
- Make sure Ollama is running: `ollama serve`
- Check if accessible: `curl http://localhost:11434`
- On WSL: Ensure you're using the Windows Ollama instance

### Model Download Slow
- Models are large (4-7GB each)
- First download takes time
- Models are cached for future use

### Port Already in Use
- Change port in `vite.config.ts`
- Or kill process using port 5173

## 🎮 Features

- 🤖 Multiple AI models to choose from
- 💬 Real-time streaming responses
- 🎨 Neon-themed futuristic UI
- 💾 Conversation history
- 🔄 Auto-reconnect on connection loss
- 🎰 Pachinko-inspired animations (coming soon)

## 📝 Default Configuration

- **Ollama URL**: http://localhost:11434
- **Default Model**: qwen2:7b
- **Dev Server**: http://localhost:5173

Enjoy your futuristic AI chat experience! 🚀✨