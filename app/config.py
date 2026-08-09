import os

# Helper function to load .env variables
def load_env():
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ[k.strip()] = v.strip()

load_env()

class Settings:
    EMAIL_USER: str = os.getenv("EMAIL_USER", "prabuarvind2005@gmail.com")
    EMAIL_PASSWORD: str = os.getenv("EMAIL_PASSWORD", "")
    RESEND_API_KEY: str = os.getenv("RESEND_API_KEY", "")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "antigravity_secure_secret_key_2026")
    PORT: int = int(os.getenv("PORT", 8000))
    ENABLE_RATE_LIMIT: bool = os.getenv("ENABLE_RATE_LIMIT", "false").lower() in ("true", "1", "t", "yes")
    RATE_LIMIT_PER_HOUR: int = int(os.getenv("RATE_LIMIT_PER_HOUR", 5))

settings = Settings()
