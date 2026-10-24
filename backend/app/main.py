import logging
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app import models
import asyncio
from app.telegram_bot import start_bot_polling
from app.database import engine, SessionLocal
from app.routers.auth import router as auth_router
from app.routers.services import router as services_router
from app.routers.slots import router as slots_router
from app.routers.bookings import router as bookings_router
from app.routers.users import router as user_router

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
app.include_router(user_router, prefix='/api')

@app.get('/')
def read_my_root():
    return {'Hello':'That`s black screen'}
@app.api_route('/api/health', methods=['GET', 'HEAD'])
def health():
    return {'status': 'ok'}
@app.on_event('startup')
async def startup_event():
    asyncio.create_task(start_bot_polling(SessionLocal))
    logging.info('Фоновая задача Telegram бота запущена')