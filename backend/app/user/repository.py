from app.database.models import User
from sqlalchemy.orm import Session

from app.enums.roles_enum import UserRole

def get_user_by_name(db: Session, login) -> User | None:
    return db.query(User).filter(User.login==login).scalar()

def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id==user_id).scalar()

def change_user_role(db: Session, user: User, new_role: UserRole) -> User | None:
    user.role = new_role

    db.commit()
    db.refresh(user)

    return user