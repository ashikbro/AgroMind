#!/bin/bash

# AgroMind Environment Check Script
# This script checks if your development environment is properly set up

echo "🌾 AgroMind Environment Check"
echo "=============================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        if [ "$2" != "" ]; then
            version=$($1 $2 2>&1)
            echo "  Version: $version"
        fi
        return 0
    else
        echo -e "${RED}✗${NC} $1 is not installed"
        return 1
    fi
}

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $2"
        return 1
    fi
}

# Check Node.js
echo "Checking Node.js..."
if check_command node "--version"; then
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    REQUIRED_VERSION="16.0.0"
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then 
        echo -e "  ${GREEN}Node.js version is sufficient${NC}"
    else
        echo -e "  ${RED}Node.js version should be >= 16.0.0${NC}"
    fi
else
    echo -e "${RED}Please install Node.js from https://nodejs.org/${NC}"
fi
echo ""

# Check npm
echo "Checking npm..."
check_command npm "--version"
echo ""

# Check MongoDB
echo "Checking MongoDB..."
if check_command mongod "--version"; then
    echo -e "  ${GREEN}MongoDB is installed${NC}"
else
    echo -e "  ${YELLOW}MongoDB not found. You can use MongoDB Atlas (cloud) instead${NC}"
    echo -e "  Install from: https://www.mongodb.com/try/download/community"
fi
echo ""

# Check Git
echo "Checking Git..."
check_command git "--version"
echo ""

# Check project structure
echo "Checking project structure..."
check_file "backend/package.json" "Backend package.json exists"
check_file "frontend/package.json" "Frontend package.json exists"
check_file "backend/.env.example" "Backend .env.example exists"
echo ""

# Check if dependencies are installed
echo "Checking dependencies..."
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies not installed"
    echo "  Run: cd backend && npm install"
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies not installed"
    echo "  Run: cd frontend && npm install"
fi
echo ""

# Check environment file
echo "Checking environment configuration..."
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} Backend .env file exists"
else
    echo -e "${YELLOW}⚠${NC} Backend .env file not found"
    echo "  Copy: cp backend/.env.example backend/.env"
    echo "  Then edit with your configuration"
fi
echo ""

# Summary
echo "=============================="
echo "Environment Check Complete!"
echo ""
echo "Next steps:"
echo "1. Fix any issues marked with ✗ or ⚠"
echo "2. Read SETUP.md for detailed instructions"
echo "3. Run 'npm install' in backend and frontend directories"
echo "4. Configure backend/.env file"
echo "5. Start the application!"
echo ""
echo "For help, see: https://github.com/ashikbro/AgroMind/blob/main/SETUP.md"
