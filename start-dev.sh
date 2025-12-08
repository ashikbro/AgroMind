#!/bin/bash

# AgroMind Quick Start Script
# This script helps you start the entire AgroMind stack quickly

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}"
echo "🌾 AgroMind Quick Start"
echo "======================="
echo -e "${NC}"

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠ Backend .env file not found${NC}"
    echo "Creating from .env.example..."
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Created backend/.env${NC}"
    echo -e "${YELLOW}⚠ Please edit backend/.env with your configuration${NC}"
    echo ""
fi

# Check if node_modules exist
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    cd backend && npm install && cd ..
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
    echo ""
fi

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd frontend && npm install && cd ..
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
    echo ""
fi

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Check if MongoDB is running
echo "Checking MongoDB..."
if pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✓ MongoDB is running${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB is not running${NC}"
    echo "Please start MongoDB manually or use MongoDB Atlas"
    echo ""
fi

# Check if ports are available
echo "Checking ports..."
if check_port 5000; then
    echo -e "${RED}✗ Port 5000 is already in use${NC}"
    echo "Backend server requires port 5000"
    read -p "Do you want to kill the process on port 5000? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -ti:5000 | xargs kill -9
        echo -e "${GREEN}✓ Port 5000 freed${NC}"
    else
        echo "Please free port 5000 manually"
        exit 1
    fi
fi

if check_port 3000; then
    echo -e "${RED}✗ Port 3000 is already in use${NC}"
    echo "Frontend server requires port 3000"
    read -p "Do you want to kill the process on port 3000? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -ti:3000 | xargs kill -9
        echo -e "${GREEN}✓ Port 3000 freed${NC}"
    else
        echo "Please free port 3000 manually"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}Starting AgroMind...${NC}"
echo ""

# Create log directory
mkdir -p logs

# Start backend
echo "Starting backend server..."
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo "  Logs: logs/backend.log"

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "Starting frontend server..."
cd frontend
BROWSER=none npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
echo "  Logs: logs/frontend.log"

# Save PIDs for later
echo $BACKEND_PID > logs/backend.pid
echo $FRONTEND_PID > logs/frontend.pid

echo ""
echo -e "${GREEN}=============================="
echo "🎉 AgroMind is starting!"
echo "==============================${NC}"
echo ""
echo "Access points:"
echo -e "  ${BLUE}Frontend:${NC} http://localhost:3000"
echo -e "  ${BLUE}Backend API:${NC} http://localhost:5000"
echo -e "  ${BLUE}GraphQL:${NC} http://localhost:5000/graphql"
echo ""
echo "Log files:"
echo "  Backend: logs/backend.log"
echo "  Frontend: logs/frontend.log"
echo ""
echo "To stop the servers, run: ./stop-dev.sh"
echo "Or press Ctrl+C and manually kill processes:"
echo "  Backend PID: $BACKEND_PID"
echo "  Frontend PID: $FRONTEND_PID"
echo ""
echo "Waiting for servers to be ready..."

# Wait for backend to be ready
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:5000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend is ready!${NC}"
        break
    fi
    attempt=$((attempt + 1))
    sleep 1
done

# Wait for frontend to be ready
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend is ready!${NC}"
        break
    fi
    attempt=$((attempt + 1))
    sleep 1
done

echo ""
echo -e "${GREEN}🚀 AgroMind is ready!${NC}"
echo -e "Open ${BLUE}http://localhost:3000${NC} in your browser"
echo ""

# Keep script running to show logs
echo "Press Ctrl+C to stop watching logs (servers will keep running)"
echo "=========================================="
echo ""

# Follow logs
tail -f logs/backend.log logs/frontend.log
