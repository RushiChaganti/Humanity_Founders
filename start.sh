#!/bin/bash

# Start the FastAPI backend in the background
echo "Starting FastAPI backend..."
cd /app/backend && uvicorn main:app --host 127.0.0.1 --port 8000 &

# Start the Next.js frontend
echo "Starting Next.js frontend on port ${PORT:-10000}..."
cd /app && HOSTNAME="0.0.0.0" PORT=${PORT:-10000} node server.js
