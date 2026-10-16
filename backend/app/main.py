from fastapi import FastAPI, Depends
from starlette.middleware.cors import CORSMiddleware
from app import models
from app.database import engine
from app.deps import get_current_user
from app.models import User
from app.routers.auth import router as auth_router
from app.schemas import UserOut

models.Base.metadata.create_all(bind=engine)
app = FastAPI(title='booking-platform', description='Проект для портфолио', version='0.0.1')
app.add_middleware(
    CORSMiddleware,
    allow_origins = ['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])

@app.get('/api/me', response_model=UserOut)
def current_user(user:User=Depends(get_current_user)):
    return user