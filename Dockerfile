# Stage 1: Build Frontend
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Final Runner (Python + Node Runtime)
FROM python:3.11-slim AS runner
WORKDIR /app

# Install Node.js in the Python image
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs build-essential libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Set Environment Variables
ENV NODE_ENV production
ENV PYTHONUNBUFFERED 1

# Copy Backend and install dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY backend/ ./backend/

# Copy Frontend build from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy and setup start script
COPY start.sh ./
RUN chmod +x start.sh

# Render looks for the port specified in the environment
EXPOSE 10000

CMD ["./start.sh"]
