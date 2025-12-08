#!/bin/bash

# AgroMind Stop Script
# This script stops the AgroMind development servers

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}"
echo "🛑 Stopping AgroMind..."
echo "======================"
echo -e "${NC}"

# Function to kill process by PID file
kill_by_pid_file() {
    if [ -f "$1" ]; then
        PID=$(cat "$1")
        if ps -p $PID > /dev/null 2>&1; then
            kill $PID 2>/dev/null
            echo -e "${GREEN}✓ Stopped $2 (PID: $PID)${NC}"
        else
            echo -e "${YELLOW}⚠ $2 process not found${NC}"
        fi
        rm "$1"
    else
        echo -e "${YELLOW}⚠ $1 not found${NC}"
    fi
}

# Stop using PID files
if [ -d "logs" ]; then
    kill_by_pid_file "logs/backend.pid" "Backend"
    kill_by_pid_file "logs/frontend.pid" "Frontend"
fi

# Kill any remaining processes on ports
echo ""
echo "Checking for remaining processes on ports..."

if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}Found process on port 5000, killing...${NC}"
    lsof -ti:5000 | xargs kill -9 2>/dev/null
    echo -e "${GREEN}✓ Port 5000 freed${NC}"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}Found process on port 3000, killing...${NC}"
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    echo -e "${GREEN}✓ Port 3000 freed${NC}"
fi

# Kill any node processes related to AgroMind
echo ""
echo "Cleaning up AgroMind processes..."
pkill -f "node.*backend" 2>/dev/null && echo -e "${GREEN}✓ Killed backend processes${NC}"
pkill -f "node.*frontend" 2>/dev/null && echo -e "${GREEN}✓ Killed frontend processes${NC}"
pkill -f "react-scripts" 2>/dev/null && echo -e "${GREEN}✓ Killed React processes${NC}"

echo ""
echo -e "${GREEN}=============================="
echo "✓ AgroMind stopped successfully"
echo "==============================${NC}"
echo ""
echo "To start again, run: ./start-dev.sh"
