from sqlalchemy.orm import Session

from app.database.models import Service

def create_service(db: Session, user_id: int, title: str, description: str, duration_minutes: int, price: int) -> Service:
    service = Service(
        master_id=user_id,
        title=title,
        description=description,
        duration_minutes=duration_minutes,
        price=price
    )
    db.add(service)
    db.flush()

    return service

def get_service_by_parametres(db: Session, title: str, description: str, duration_minutes: int, price: int) -> Service | None:
    return db.query(Service).filter(Service.title==title, Service.description==description,
                                    Service.duration_minutes==duration_minutes, Service.price==price).scalar()