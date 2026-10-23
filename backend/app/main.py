from fastapi import FastAPI, Depends
from starlette.middleware.cors import CORSMiddleware
from app import models
from app.database import engine
from app.deps import get_current_user
from app.models import User
from app.schemas import UserOut
from app.routers.auth import router as auth_router
from app.routers.services import router as services_router
from app.routers.slots import router as slots_router
from app.routers.bookings import router as bookings_router

models.Base.metadata.create_all(bind=engine)
app = FastAPI(title='booking-platform', description='Проект для портфолио', version='0.0.1')
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://booking-platform-navy-seven.vercel.app",
        "http://localhost:5173",          
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(services_router, prefix='/api/services', tags=['services'])
app.include_router(slots_router, prefix='/api', tags=['slots'])
app.include_router(bookings_router, prefix='/api', tags=['bookings'])

@app.get('/api/me', response_model=UserOut)
def current_user(user:User=Depends(get_current_user)):
    return user
@app.get('/')
def read_my_root():
    return {'Hello':'That`s black screen'}
@app.api_route('/api/health', methods=['GET', 'HEAD'])
def health():
    return {'status': 'ok'}