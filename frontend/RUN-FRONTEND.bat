@echo off
setlocal enabledelayedexpansion

echo.
echo ================================================
echo    🌾 AgroMind Frontend Application 🌾
echo ================================================
echo.

:: Change to frontend directory
cd /d "E:\project\AgroMind\frontend"
echo Current directory: %CD%

:: Check Node.js
echo [1/4] Checking Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js is not installed
    echo 📥 Please install from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is ready

:: Install dependencies
echo [2/4] Installing frontend dependencies...
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
) else (
    echo 🔄 Dependencies already installed
)

:: Check backend connection
echo [3/4] Checking backend connection...
echo ⏳ Make sure backend is running on port 4000
echo 🔗 Backend should be at: http://localhost:4000

:: Start frontend
echo [4/4] Starting frontend development server...
echo.
echo ================================================
echo    🚀 Starting AgroMind Frontend 🚀
echo ================================================
echo.
echo 🌐 Frontend will be available at: http://localhost:3000
echo 🔗 Backend connection: http://localhost:4000
echo 📱 All features available: AI, Analytics, Voice Commands
echo.
echo 💡 Press Ctrl+C to stop the frontend
echo ⏰ Starting in 3 seconds...
timeout /t 3 /nobreak >nul

echo.
echo 🟢 Frontend starting...
call npm start

echo.
echo 🔴 Frontend stopped
pause
