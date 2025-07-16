# Development container for Pachinko Chat
FROM mcr.microsoft.com/devcontainers/typescript-node:20

# Install system dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    curl \
    wget \
    git \
    npm \
    build-essential \
    ca-certificates \
    gnupg \
    lsb-release \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Create directory for Ollama models
RUN mkdir -p /home/node/.ollama && chown -R node:node /home/node/.ollama

# Switch to node user
USER node

# Set working directory
WORKDIR /workspace/pachinko



# Copy package files
COPY --chown=node:node package*.json ./
#COPY --chown=node:node package.json package-lock.json ./


RUN ls -la && cat package-lock.json | head -n 5 || echo "package-lock.json fehlt"

RUN curl -v https://registry.npmjs.com/

# Install dependencies
#RUN npm install

RUN git clone https://github.com/YmClash/pachinko.git
RUN cd pachinko && npm install


# Copy the rest of the application
COPY --chown=node:node/pachinko . .



# Expose ports
EXPOSE 5173 11434

# Set environment variables
ENV VITE_OLLAMA_URL=http://localhost:11434
ENV VITE_DEFAULT_MODEL=qwen2:7b
ENV VITE_ENABLE_SOUNDS=true
ENV VITE_ENABLE_3D=true

# Create a startup script
RUN echo '#!/bin/bash\n\
echo "🚀 Starting Pachinko Chat Dev Environment..by.YmC."\n\
echo ""\n\
echo "📦 Installing dependencies..."\n\
ollama serve &\n\
echo ""\n\
echo "🤖 Starting Ollama service..."\n\
ls\n\
OLLAMA_PID=$!\n\
echo "Ollama PID: $OLLAMA_PID"\n\
sleep 5\n\
echo ""\n\
echo "📥 Pulling default AI models..."\n\
ollama pull qwen2:7b || echo "Failed to pull qwen2:7b"\n\
ollama pull gemma2:9b || echo "Failed to pull gemma2:9b"\n\
echo ""\n\
echo "🎮 Starting development server..."\n\
npm run dev \n\
' > /home/node/start-dev.sh && chmod +x /home/node/start-dev.sh

# Default command
CMD ["/home/node/start-dev.sh"]