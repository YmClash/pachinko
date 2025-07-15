#!/bin/bash

# Pachinko Ollama Chat - Installation and Launch Script
# This script installs Ollama, downloads AI models, and launches the Pachinko chat application

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ASCII Art
echo -e "${PURPLE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║    ____            _     _       _           ____ _           ║"
echo "║   |  _ \ __ _  ___| |__ (_)_ __ | | _____   / ___| |__   ___  ║"
echo "║   | |_) / _\` |/ __| '_ \| | '_ \| |/ / _ \ | |   | '_ \ / _ \ ║"
echo "║   |  __/ (_| | (__| | | | | | | |   < (_) || |___| | | | (_) |║"
echo "║   |_|   \__,_|\___|_| |_|_|_| |_|_|\_\___/  \____|_| |_|\___/ ║"
echo "║                                                               ║"
echo "║                 🎰 Futuristic AI Chat Interface 🤖            ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to print colored messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if grep -qi microsoft /proc/version; then
            echo "wsl"
        else
            echo "linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}

OS=$(detect_os)
print_status "Detected OS: $OS"

# Check if Ollama is installed
check_ollama() {
    if command -v ollama &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Install Ollama
install_ollama() {
    print_status "Installing Ollama..."
    
    case $OS in
        "linux"|"wsl")
            curl -fsSL https://ollama.com/install.sh | sh
            ;;
        "macos")
            if command -v brew &> /dev/null; then
                brew install ollama
            else
                print_error "Homebrew not found. Please install Homebrew first or download Ollama from https://ollama.com"
                exit 1
            fi
            ;;
        "windows")
            print_warning "Please download and install Ollama manually from https://ollama.com/download/windows"
            print_warning "After installation, run this script again."
            exit 1
            ;;
        *)
            print_error "Unsupported OS. Please install Ollama manually from https://ollama.com"
            exit 1
            ;;
    esac
}

# Start Ollama service
start_ollama() {
    print_status "Starting Ollama service..."
    
    # Check if Ollama is already running
    if curl -s http://localhost:11434/ &> /dev/null; then
        print_success "Ollama is already running"
        return 0
    fi
    
    case $OS in
        "linux")
            if systemctl is-active --quiet ollama; then
                print_success "Ollama service is already running"
            else
                sudo systemctl start ollama || ollama serve &
                sleep 3
            fi
            ;;
        "wsl"|"macos")
            # Start Ollama in background
            ollama serve > /dev/null 2>&1 &
            OLLAMA_PID=$!
            print_status "Started Ollama with PID: $OLLAMA_PID"
            sleep 5
            ;;
        "windows")
            print_warning "Please ensure Ollama is running on Windows"
            ;;
    esac
    
    # Wait for Ollama to be ready
    print_status "Waiting for Ollama to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:11434/ &> /dev/null; then
            print_success "Ollama is ready!"
            return 0
        fi
        sleep 1
    done
    
    print_error "Ollama failed to start"
    return 1
}

# Pull AI models
pull_models() {
    local models=("qwen2:7b" "gemma2:9b" "llama3.2:latest")
    
    print_status "Pulling AI models... This may take a while on first run."
    
    for model in "${models[@]}"; do
        echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        print_status "Pulling model: $model"
        
        if ollama list | grep -q "^$model"; then
            print_success "Model $model is already downloaded"
        else
            if ollama pull "$model"; then
                print_success "Successfully pulled $model"
            else
                print_warning "Failed to pull $model, continuing with other models..."
            fi
        fi
    done
    
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Check Node.js and npm
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js (v18+) first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js $(node --version) and npm $(npm --version) detected"
}

# Install npm dependencies
install_dependencies() {
    print_status "Installing npm dependencies..."
    
    if [ ! -d "node_modules" ]; then
        npm install
    else
        print_success "Dependencies already installed"
    fi
}

# Launch Pachinko
launch_pachinko() {
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    print_success "All set! Launching Pachinko Chat..."
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    print_status "Opening http://localhost:5173 in your browser..."
    
    # Try to open browser
    case $OS in
        "linux"|"wsl")
            if command -v xdg-open &> /dev/null; then
                xdg-open http://localhost:5173 &
            elif [ -n "$WSL_DISTRO_NAME" ]; then
                cmd.exe /c start http://localhost:5173 &
            fi
            ;;
        "macos")
            open http://localhost:5173 &
            ;;
    esac
    
    # Start the development server
    npm run dev
}

# Main execution
main() {
    echo
    print_status "Starting Pachinko Chat setup..."
    echo
    
    # Check Node.js
    check_node
    
    # Install dependencies
    install_dependencies
    
    # Check and install Ollama if needed
    if check_ollama; then
        print_success "Ollama is already installed"
    else
        install_ollama
    fi
    
    # Start Ollama service
    start_ollama
    
    # Pull models
    pull_models
    
    # List available models
    echo
    print_status "Available models:"
    ollama list
    echo
    
    # Launch Pachinko
    launch_pachinko
}

# Cleanup function
cleanup() {
    if [ ! -z "$OLLAMA_PID" ]; then
        print_status "Stopping Ollama service..."
        kill $OLLAMA_PID 2>/dev/null || true
    fi
}

# Set up cleanup on exit
trap cleanup EXIT

# Run main function
main