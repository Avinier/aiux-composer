#!/bin/bash

# ==========================================
# Meaningmaking Canvas - Express Server Version
# ==========================================

echo "🎯 Starting Meaningmaking Canvas (Express + React)"
echo "=================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check for .env
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo ""
    echo "Create .env with your GLM API key:"
    echo "  GLM_API_KEY=your-key-here"
    exit 1
fi

# Cleanup function
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down services...${NC}"
    kill $SERVER_PID 2>/dev/null
    kill $REACT_PID 2>/dev/null
    exit
}

trap cleanup EXIT INT TERM

# Install server dependencies if needed
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server
    npm install
    cd ..
fi

# Start Express server
echo -e "${GREEN}🚀 Starting Express API Server...${NC}"
echo "   URL: http://localhost:8000"
echo "   Health: http://localhost:8000/health"
echo ""

cd server
node index.js > server.log 2>&1 &
SERVER_PID=$!
cd ..

# Wait for server
sleep 3

if ! curl -s http://localhost:8000/health > /dev/null; then
    echo -e "${RED}❌ Server failed to start!${NC}"
    echo "Check server/server.log for errors"
    exit 1
fi

echo -e "${GREEN}✅ Server is running!${NC}"
echo ""

# Start React app
echo -e "${GREEN}🎨 Starting React App...${NC}"
echo "   URL: http://localhost:5173"
echo ""

# Make sure frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start React
VITE_API_URL=http://localhost:8000 npm run dev &
REACT_PID=$!

sleep 3

echo ""
echo "=================================================="
echo -e "${GREEN}✨ Meaningmaking Canvas is ready!${NC}"
echo ""
echo "📍 React App: http://localhost:5173"
echo "📍 API Server: http://localhost:8000"
echo "📍 API Health: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop all services"
echo "=================================================="
echo ""

wait