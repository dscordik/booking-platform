from datetime import datetime, timedelta

from app.database import SessionLocal
from app.models import Service, Slot

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
    now = datetime.utcnow().replace(minute=0, second=0, microsecond=0)
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


def seed_db():
    db = SessionLocal()

    try:
        db.query(Slot).delete()
        db.query(Service).delete()
        db.commit()
        print("Старые услуги и слоты удалены. Таблицы очищены.")

        added_services = 0
        for item in services:
            service = Service(**item)
            db.add(service)
            added_services += 1
        db.commit()
        print(f"Добавлено {added_services} новых услуг в базу.")

        all_services = db.query(Service).all()
        total_slots = 0
        for service in all_services:
            generate_slots(db, service)
            total_slots += 480 // service.duration_min * 7
        db.commit()
        print(f"Сгенерировано ~{total_slots} слотов на 7 дней вперёд.")

    except Exception as e:
        print(f"Ошибка при сиде: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_db()