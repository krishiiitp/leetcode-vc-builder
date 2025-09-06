from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from auth.utils.auth_utils import get_password_hash
from user.models.user import User
from user.schemas.user import UserCreate
from sqlalchemy.exc import IntegrityError


def get_user_by_username(db: Session, username: str):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with username '{username}' not found"
        )
    return user


def create_user(db: Session, user: UserCreate):
    existing_username = db.query(User).filter(User.username == user.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"user with username: {user.username} already exists!",
        )

    db_user = User(
        username=user.username,
        password=get_password_hash(user.password)
    )

    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user with given username already exists!",
        )

    return db_user


def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )

    db.delete(db_user)
    db.commit()
    return {"detail": f"User with id {user_id} deleted successfully"}