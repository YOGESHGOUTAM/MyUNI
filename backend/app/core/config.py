from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    LLM_API_URL: str
    OPENAI_API_KEY: str
    LLM_MODEL: str = "gpt-4o-mini"  # default (change if needed)
    EMBEDDING_API_URL: str | None = None
    EMBEDDING_API_KEY: str | None = None
    EMBEDDING_MODEL: str = "text-embedding-3-small"

    class Config:
        env_file = ".env"

settings = Settings()
