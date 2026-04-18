# Use Python 3.12 slim version
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Run using Uvicorn (for FastAPI) or Gunicorn (for Flask/Django)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "10000"]