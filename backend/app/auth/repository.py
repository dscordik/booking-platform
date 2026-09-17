from sqlalchemy.orm import Session

from app.database.models import User


def create_user(db: Session, login, email, hash_password, first_name, last_name, role):
    user = User(
        login=login,
        email=email,
        password_hash=hash_password,
        first_name=first_name,
        last_name=last_name, 
        role=role
    )
    db.add(user)
    db.flush()

    return user
