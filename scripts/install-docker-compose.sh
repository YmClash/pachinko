#!/bin/bash

# Install Docker Compose for Codespaces/Linux environments

set -e

echo "🔧 Installing Docker Compose..."

# Detect OS and architecture
OS=$(uname -s)
ARCH=$(uname -m)

# Convert architecture names
case $ARCH in
    x86_64)
        ARCH="x86_64"
        ;;
    aarch64|arm64)
        ARCH="aarch64"
        ;;
    *)
        echo "❌ Unsupported architecture: $ARCH"
        exit 1
        ;;
esac

# Docker Compose version
COMPOSE_VERSION="v2.24.5"

# Download URL
DOWNLOAD_URL="https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-${OS}-${ARCH}"

echo "📥 Downloading Docker Compose ${COMPOSE_VERSION} for ${OS}-${ARCH}..."

# Download and install
if command -v sudo &> /dev/null; then
    sudo curl -SL "${DOWNLOAD_URL}" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    curl -SL "${DOWNLOAD_URL}" -o ~/.local/bin/docker-compose
    chmod +x ~/.local/bin/docker-compose
    export PATH="$HOME/.local/bin:$PATH"
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
fi

# Create symlink for 'docker compose' command
if command -v docker &> /dev/null; then
    DOCKER_CLI_PLUGINS="$HOME/.docker/cli-plugins"
    mkdir -p "$DOCKER_CLI_PLUGINS"
    ln -sf /usr/local/bin/docker-compose "$DOCKER_CLI_PLUGINS/docker-compose" 2>/dev/null || \
    ln -sf ~/.local/bin/docker-compose "$DOCKER_CLI_PLUGINS/docker-compose" 2>/dev/null || true
fi

# Verify installation
echo "✅ Checking installation..."
docker-compose version || docker compose version

echo "✅ Docker Compose installed successfully!"