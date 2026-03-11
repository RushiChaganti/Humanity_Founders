FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for PostgreSQL and building packages
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set Environment Variables
ENV PYTHONUNBUFFERED 1
# Render provides the PORT environment variable
ENV PORT 10000

# Copy Backend requirements first for better caching
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend source code
COPY backend/ .

# Expose the port (Render will use its own)
EXPOSE 10000

# Run the FastAPI application
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}
