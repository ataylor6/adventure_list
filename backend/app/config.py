from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_ROOT = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_BACKEND_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = "postgresql+psycopg://ashleytaylor@localhost:5432/gram"
    # Override at launch: APP_MODE=full uvicorn ...
    # waitlist = public (docs off, mobile shows signup)
    # full     = local/dev (docs on, mobile opens full app)
    app_mode: str = "waitlist"

    @property
    def mode(self) -> str:
        return "full" if self.app_mode.lower() == "full" else "waitlist"

    @property
    def is_waitlist(self) -> bool:
        return self.mode == "waitlist"

    @property
    def is_full(self) -> bool:
        return self.mode == "full"


settings = Settings()
