from app.database import SessionLocal
from app.models import Service

services = [
    {
        "title": "Первичная консультация",
        "description": "Знакомство с терапевтом, формулирование запроса и понимание, подходим ли мы друг другу",
        "duration_min": 50,
        "price": 2000
    },
    {
        "title": "Работа с тревогой",
        "description": "Разбор причин тревожных состояний, техники саморегуляции и стратегия снижения напряжения",
        "duration_min": 60,
        "price": 3000
    },
    {
        "title": "Отношения и границы",
        "description": "Проработка сложных паттернов в отношениях с партнёром, родителями или коллегами",
        "duration_min": 60,
        "price": 3000
    },
    {
        "title": "Самооценка и самопринятие",
        "description": "Работа с внутренним критиком, поиск опоры и формирование здорового отношения к себе",
        "duration_min": 60,
        "price": 3000
    },
    {
        "title": "Выгорание и апатия",
        "description": "Диагностика стадии выгорания, поиск ресурсов и план восстановления",
        "duration_min": 90,
        "price": 4000
    },
    {
        "title": "Пакет из 5 сессий",
        "description": "Курс глубокой работы по выбранному запросу со скидкой 15%",
        "duration_min": 300,
        "price": 12500
    }
]

def seed_db():
    db = SessionLocal()

    try:
        db.query(Service).delete()
        db.commit()
        print('Старые услуги удалены. Таблица очищена')
        added = 0
        for item in services:
            service = Service(**item)
            db.add(service)
            added += 1
        db.commit()

        if added:
            print(f'Добавлено {added} новых услуг в базу')
        else:
            print('Новых товаров не найдено, база уже актуальна')
    except Exception as e:
        print(f'Ошибка при добавлении {e}')
        db.rollback()
    finally:
        db.close()

if __name__ == '__main__':
    seed_db()