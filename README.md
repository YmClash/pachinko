# 🎰 Pachinko Ollama Chat

A futuristic chat interface with Pachinko-inspired 3D animations, neon aesthetics, and real-time AI streaming powered by Ollama.

![Pachinko Chat](https://img.shields.io/badge/Status-Beta-yellow)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18.3-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.178-green)

## ✨ Features

- 🤖 **Real-time AI Chat** - Stream responses from Ollama models
- 🎨 **Neon Cyberpunk UI** - Glowing effects, animations, and custom components
- 🎰 **3D Pachinko Physics** - Interactive ball-drop animations with Three.js
- 💾 **Persistent Storage** - IndexedDB with localStorage fallback
- 🎵 **Sound Effects** - Immersive audio feedback (optional)
- 🌈 **Customizable** - Toggle effects, change models, adjust settings
- 📱 **Responsive** - Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- [Ollama](https://ollama.ai/) installed and running
- At least one Ollama model (e.g., `ollama pull llama2`)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pachinko.git
cd pachinko

# Install dependencies
npm install --legacy-peer-deps

# Start Ollama (in a separate terminal)
ollama serve

# Run the development server
npm run dev
```

Open http://localhost:5173 in your browser.

## 🛠️ Development

### Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # Run TypeScript type checking
npm run lint         # Run ESLint
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

### Sound Effects

Add your own sound files to `public/sounds/`:
- `ball-drop.mp3` - Ball collision sound
- `win.mp3` - Success sound
- `message.mp3` - Message sent sound
- `click.mp3` - UI click sound
- `error.mp3` - Error sound

## 🐛 Troubleshooting

### Ollama Connection Issues

1. Ensure Ollama is running: `ollama serve`
2. Check if a model is installed: `ollama list`
3. Verify the connection: `curl http://localhost:11434/api/tags`

### Performance Issues

- Disable 3D effects in Settings
- Reduce particle count in `PachinkoBackground.tsx`
- Use Chrome/Edge for best WebGL performance

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai/) for the AI backend
- [Three.js](https://threejs.org/) for 3D graphics
- [Framer Motion](https://www.framer.com/motion/) for animations
- Inspired by Japanese Pachinko machines 🎰