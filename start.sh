#!/bin/bash

echo "🚀 Starting ZeroAI Website Development Server..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the development server
echo "🎉 Starting Vite development server..."
echo "📍 Navigate to http://localhost:3000"
echo ""
npm run dev
