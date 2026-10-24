from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL:str
    SECRET_KEY:str
    ACCESS_TOKEN:int=30
    ALGORITHM:str='HS256'

    BOT_TOKEN:str
    BOT_USERNAME:str

    model_config = SettingsConfigDict(env_file='.env')
settings = Settings()