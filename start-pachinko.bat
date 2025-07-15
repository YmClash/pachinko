@echo off
setlocal enabledelayedexpansion

:: Pachinko Ollama Chat - Windows Installation and Launch Script
:: This script installs Ollama, downloads AI models, and launches the Pachinko chat application

:: Colors setup
echo.

:: ASCII Art
echo ===============================================================
echo.
echo     ____            _     _       _           ____ _           
echo    ^|  _ \ __ _  ___^| ^|__ (_)_ __ ^| ^| _____   / ___^| ^|__   ___  
echo    ^| ^|_) / _` ^|/ __^| '_ \^| ^| '_ \^| ^|/ / _ \ ^| ^|   ^| '_ \ / _ \ 
echo    ^|  __/ (_^| ^| (__^| ^| ^| ^| ^| ^| ^| ^|   ^< (_) ^|^| ^|___^| ^| ^| ^| (_) ^|
echo    ^|_^|   \__,_^|\___^|_^| ^|_^|_^|_^| ^|_^|_^|\_\___/  \____^|_^| ^|_^|\___/ 
echo.
echo                   Futuristic AI Chat Interface
echo.
echo ===============================================================
echo.

:: Check if Node.js is installed
echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js v18+ from https://nodejs.org
    pause
    exit /b 1
)

:: Check Node.js version
for /f "tokens=1,2 delims=v." %%a in ('node --version') do (
    if %%b lss 18 (
        echo [ERROR] Node.js version 18 or higher is required. Current version: %%a.%%b
        pause
        exit /b 1
    )
)

echo [SUCCESS] Node.js detected: 
node --version
npm --version
echo.

:: Install npm dependencies if needed
if not exist "node_modules" (
    echo [INFO] Installing npm dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo [SUCCESS] Dependencies already installed
)
echo.

:: Check if Ollama is installed
echo [INFO] Checking Ollama installation...
where ollama >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Ollama is not installed or not in PATH
    echo.
    echo Please install Ollama manually:
    echo 1. Download from: https://ollama.com/download/windows
    echo 2. Install Ollama
    echo 3. Run this script again
    echo.
    echo Press any key to open the download page...
    pause >nul
    start https://ollama.com/download/windows
    exit /b 1
) else (
    echo [SUCCESS] Ollama is installed
)
echo.

:: Check if Ollama is running
echo [INFO] Checking if Ollama service is running...
curl -s http://localhost:11434/ >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Starting Ollama service...
    start /min cmd /c "ollama serve"
    
    :: Wait for Ollama to start
    echo [INFO] Waiting for Ollama to start...
    :wait_ollama
    timeout /t 2 /nobreak >nul
    curl -s http://localhost:11434/ >nul 2>&1
    if %errorlevel% neq 0 goto wait_ollama
) else (
    echo [SUCCESS] Ollama service is already running
)
echo.

:: Pull AI models
echo ===============================================================
echo [INFO] Pulling AI models... This may take a while on first run.
echo ===============================================================
echo.

:: Model list
set models[0]=qwen2:7b
set models[1]=gemma2:9b
set models[2]=llama3.2:latest

:: Pull each model
for /l %%i in (0,1,2) do (
    echo [INFO] Checking model: !models[%%i]!
    
    :: Check if model exists
    ollama list | findstr /i "!models[%%i]!" >nul 2>&1
    if !errorlevel! equ 0 (
        echo [SUCCESS] Model !models[%%i]! is already downloaded
    ) else (
        echo [INFO] Pulling model: !models[%%i]!
        ollama pull !models[%%i]!
        if !errorlevel! equ 0 (
            echo [SUCCESS] Successfully pulled !models[%%i]!
        ) else (
            echo [WARNING] Failed to pull !models[%%i]!, continuing...
        )
    )
    echo.
)

:: List available models
echo ===============================================================
echo [INFO] Available models:
ollama list
echo ===============================================================
echo.

:: Launch Pachinko
echo [SUCCESS] All set! Launching Pachinko Chat...
echo [INFO] Opening http://localhost:5173 in your browser...
echo.

:: Open browser
start http://localhost:5173

:: Start development server
echo [INFO] Starting development server...
echo Press Ctrl+C to stop the server
echo.
npm run dev

pause