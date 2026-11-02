from datetime import datetime, timedelta, timezone
from sqlalchemy import select
from app.database import SessionLocal
from app.models import Service, Slot, User, Booking
from app.security import hash_password

services = [
    {
        "title": "Первичная консультация",
        "description": "Знакомство с терапевтом, формулирование запроса и понимание, подходим ли мы друг другу",
        "duration_min": 50,
        "price": 2000,
    },
    {
        "title": "Работа с тревогой",
        "description": "Разбор причин тревожных состояний, техники саморегуляции и стратегия снижения напряжения",
        "duration_min": 60,
        "price": 3000,
    },
    {
        "title": "Отношения и границы",
        "description": "Проработка сложных паттернов в отношениях с партнёром, родителями или коллегами",
        "duration_min": 60,
        "price": 3000,
    },
    {
        "title": "Самооценка и самопринятие",
        "description": "Работа с внутренним критиком, поиск опоры и формирование здорового отношения к себе",
        "duration_min": 60,
        "price": 3000,
    },
    {
        "title": "Выгорание и апатия",
        "description": "Диагностика стадии выгорания, поиск ресурсов и план восстановления",
        "duration_min": 90,
        "price": 4000,
    },
    {
        "title": "Пакет из 5 сессий",
        "description": "Курс глубокой работы по выбранному запросу со скидкой 15%",
        "duration_min": 300,
        "price": 12500,
    },
]


def generate_slots(db: SessionLocal, service: Service):
    now = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0)
    for day in range(7):
        day_start = (now + timedelta(days=day)).replace(hour=10, minute=0)
        slots_per_day = 480 // service.duration_min
        for i in range(slots_per_day):
            start = day_start + timedelta(minutes=i * service.duration_min)
            end = start + timedelta(minutes=service.duration_min)
            db.add(
                Slot(
                    service_id=service.id,
                    start_at=start,
                    end_at=end,
                    is_booked=False,
                )
            )

def check_admin(db:SessionLocal):
    admin = db.query(User).filter(User.email == 'admin@booking.local').first()
    if not admin:
        hashed_password = hash_password('admin123')
        new_admin = User(
            email='admin@booking.local',
            hashed_password=hashed_password,
            role='admin'
        )
        db.add(new_admin)
        db.commit()
        print(f'Админ создан: с почтой admin@booking.local и паролем admin123')
    else:
        print(f'Админ уже существует, пропускаем его создание')

def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)

def ensure_services(db):
    if db.query(Service).count() > 0:
        print("Услуги уже есть, пропускаем")
        return
    for item in services:
        db.add(Service(**item))
    db.commit()
    print(f"Добавлено услуг: {len(services)}")

def top_up_slots(db):
    now = utc_now()
    used = select(Booking.slot_id)
    deleted = (
        db.query(Slot)
        .filter(Slot.start_at < now, Slot.id.not_in(used))
        .delete(synchronize_session=False)
    )
    added = 0
    for service in db.query(Service).all():
        slots_per_day = 480 // service.duration_min
        for day in range(7):
            day_start = (now + timedelta(days=day)).replace(
                hour=10, minute=0, second=0, microsecond=0
            )
            for i in range(slots_per_day):
                start = day_start + timedelta(minutes=i * service.duration_min)
                if start < now:
                    continue
                exists = db.query(Slot.id).filter(
                    Slot.service_id == service.id, Slot.start_at == start
                ).first()
                if exists:
                    continue
                db.add(Slot(
                    service_id=service.id,
                    start_at=start,
                    end_at=start + timedelta(minutes=service.duration_min),
                    is_booked=False,
                ))
                added += 1
    db.commit()
    print(f"Удалено старых слотов: {deleted}, добавлено новых: {added}")

def seed_db():
    db = SessionLocal()
    try:
        check_admin(db)
        ensure_services(db)
        top_up_slots(db)
    except Exception as e:
        print(f"Ошибка при сиде: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_db()