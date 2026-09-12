#!/bin/bash
set -e
cd "$(dirname "$0")"

# Start backend API
cd backend
node server.js &
BACKEND_PID=$!
cd ..

# Start frontend (exposed preview port)
cd frontend
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
