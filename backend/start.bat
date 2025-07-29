@echo off
echo.
echo ================================
echo   AgroMind Backend Quick Start
echo ================================
echo.

cd /d "E:\project\AgroMind\backend"
echo Current directory: %CD%

echo.
echo Checking Node.js...
node --version
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Checking NPM...
npm --version
if %ERRORLEVEL% neq 0 (
    echo ERROR: NPM is not available
    pause
    exit /b 1
)

echo.
echo Testing basic Node.js execution...
node simple-test.js
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js execution failed
    pause
    exit /b 1
)

echo.
echo Running backend test...
node test-backend.js
if %ERRORLEVEL% neq 0 (
    echo WARNING: Backend test encountered issues
    echo This is normal for first run
)

echo.
echo Checking if dependencies are installed...
if exist "node_modules" (
    echo ✅ Dependencies found
) else (
    echo Installing dependencies...
    npm install
)

echo.
echo Starting backend server...
echo Press Ctrl+C to stop the server
echo.
npm start

pause
