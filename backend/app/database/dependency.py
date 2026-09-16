#Зависимости. Выполнение некоторых функций будет зависеть от этих. Перед выполнением функции будут выполняться зависимости, потом ф-ии

from app.database.database import LocalSession

def get_db():
    db = LocalSession()

    try:
        yield db
    finally:
        db.close()