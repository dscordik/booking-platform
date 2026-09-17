from fastapi import FastAPI

from app.auth.router import router as auth_router
from app.user.router import router as user_router
from app.database.database import Base, engine

app = FastAPI()

app.include_router(auth_router, prefix='/auth', tags=['Registration'])
app.include_router(user_router, prefix='/user', tags=['Change Role'])

Base.metadata.create_all(bind=engine)