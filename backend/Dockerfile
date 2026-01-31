FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (OCR + Postgres)
RUN apt-get update && apt-get install -y \
    build-essential \
    postgresql-client \
    tesseract-ocr \
    poppler-utils \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# (Optional) Add extra OCR languages like Hindi
RUN apt-get install -y tesseract-ocr-hin

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1

CMD ["sh", "-c", "sleep 12 && alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
