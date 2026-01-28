import requests
from app.core.config import settings

def get_embedding(text: str) -> list[float]:
    if not settings.EMBEDDING_API_KEY:
        raise RuntimeError("Missing OpenAI API key")

    response = requests.post(
        "https://api.openai.com/v1/embeddings",
        headers={
            "Authorization": f"Bearer {settings.EMBEDDING_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "text-embedding-3-large",
            "input": text
        },
        timeout=30
    )

    if response.status_code == 401:
        raise RuntimeError(
            "401 Unauthorized — check API key or billing status"
        )

    response.raise_for_status()
    return response.json()["data"][0]["embedding"]
