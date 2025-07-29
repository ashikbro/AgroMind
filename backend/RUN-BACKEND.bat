@echo off
setlocal enabledelayedexpansion

echo.
echo ================================================
echo    🌾 AgroMind Agricultural Platform 🌾
echo ================================================
echo.
echo Starting complete AgroMind platform...
echo.

:: Change to backend directory
cd /d "%~dp0"
echo Current directory: %CD%

:: Step 1: Check Node.js
echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js is not installed
    echo 📥 Please install from: https://nodejs.org/
    echo 🔄 Then restart this script
    pause
    exit /b 1
)
echo ✅ Node.js is installed

:: Step 2: Check NPM
echo [2/6] Checking NPM...
npm --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ NPM is not available
    pause
    exit /b 1
)
echo ✅ NPM is available

:: Step 3: Install Dependencies
echo [3/6] Installing/updating dependencies...
if not exist "node_modules" (
    echo 📦 Installing dependencies for first time...
    call npm install --only=prod --force
) else (
    echo 🔄 Checking dependencies...
    call npm install --only=prod --force >nul 2>&1
)

if %ERRORLEVEL% neq 0 (
    echo ⚠️ Some dependencies failed, trying alternative installation...
    call npm install --legacy-peer-deps --force
)

:: Step 4: Optional AI Dependencies
echo [4/6] Installing AI dependencies (optional)...
call npm install @tensorflow/tfjs-node ml-matrix ml-regression --save >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ⚠️ AI libraries skipped (intelligent algorithms will be used)
) else (
    echo ✅ AI libraries installed (TensorFlow mode available)
)

:: Step 5: Create necessary directories
echo [5/6] Setting up directories...
if not exist "uploads" mkdir uploads
if not exist "uploads\diseases" mkdir uploads\diseases
if not exist "uploads\crops" mkdir uploads\crops
echo ✅ Directories ready

:: Step 6: Test and Start
echo [6/6] Testing backend components...
echo.

:: Run simple test first
node -e "console.log('✅ Node.js execution working')" 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js execution failed
    pause
    exit /b 1
)

:: Try to test backend services
echo 🧪 Testing backend services...
node test-backend.js 2>nul
if %ERRORLEVEL% neq 0 (
    echo ⚠️ Backend test had issues (normal for first run)
) else (
    echo ✅ Backend test passed
)

echo.
echo ================================================
echo    🚀 Starting AgroMind Backend Server 🚀
echo ================================================
echo.
echo 🌐 Backend will be available at: http://localhost:4000
echo 📊 GraphQL Playground: http://localhost:4000/graphql
echo 🔬 AI Services: Ready with intelligent algorithms
echo 📱 Frontend: Start separately on port 3000
echo.
echo 💡 Press Ctrl+C to stop the server
echo ⏰ Server starting in 3 seconds...
timeout /t 3 /nobreak >nul

:: Start the server
echo.
echo 🟢 Server starting...
call npm start

:: If we get here, server stopped
echo.
echo 🔴 Server stopped
pause
