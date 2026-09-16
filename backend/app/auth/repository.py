from sqlalchemy.orm import Session

from app.database.models import User

def create_user(db: Session, login, email, hash_password, first_name, last_name):
    user = User(
        login=login,
        email=email,
        password_hash=hash_password,
        first_name=first_name,
        last_name=last_name
    )
    db.add(user)
    db.flush()

    return user

def get_user_by_name(db: Session, login) -> User | None:
    return db.query(User).filter(User.login==login).scalar()