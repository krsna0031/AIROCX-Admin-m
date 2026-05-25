# Use Python 3.12 slim version
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run refactored module app.main
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "10000"]