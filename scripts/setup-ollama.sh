#!/bin/bash

# Setup Ollama in devcontainer
set -e

echo "🔧 Setting up Ollama in devcontainer..."

# Start Ollama service in background
echo "🚀 Starting Ollama service..."
ollama serve > /tmp/ollama.log 2>&1 &
OLLAMA_PID=$!

# Wait for Ollama to be ready
echo "⏳ Waiting for Ollama to start..."
for i in {1..30}; do
    if curl -s http://localhost:11434/ > /dev/null 2>&1; then
        echo "✅ Ollama is ready!"
        break
    fi
    sleep 1
done

# Check if Ollama started successfully
if ! curl -s http://localhost:11434/ > /dev/null 2>&1; then
    echo "❌ Failed to start Ollama"
    cat /tmp/ollama.log
    exit 1
fi

# Pull default models
echo "📥 Pulling AI models..."
echo "This may take a while on first run..."

models=("qwen2:7b" "gemma2:9b" "llama3.2:latest")

for model in "${models[@]}"; do
    echo "📦 Pulling $model..."
    if ollama pull "$model"; then
        echo "✅ Successfully pulled $model"
    else
        echo "⚠️  Failed to pull $model, continuing..."
    fi
done

# List available models
echo ""
echo "📋 Available models:"
ollama list

echo ""
echo "✨ Ollama setup complete!"