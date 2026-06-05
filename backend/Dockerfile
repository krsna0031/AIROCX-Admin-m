# Use Python 3.12 slim version
FROM python:3.12-slim

WORKDIR /app

# Install dependencies first (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Render provides PORT via environment variable (default 10000)
ENV PORT=10000
EXPOSE ${PORT}

# Run with dynamic port binding
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT