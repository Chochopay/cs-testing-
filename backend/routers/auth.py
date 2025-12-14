from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Role
from schemas import UserCreate, UserRead, UserLogin
from code import TEACHER_CODE


router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserRead)
def register(user: UserCreate, db: Session = Depends(get_db)):

    role = db.query(Role).filter(Role.name == user.role.lower()).first()
    if not role:
        raise HTTPException(status_code=400, detail="Такой роли не существует")

    if role.name == "teacher":
        if not user.teacher_code or user.teacher_code != TEACHER_CODE:
            raise HTTPException(status_code=403, detail="Неправильный код учителя")

    existing_user = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    db_user = User(username=user.username, email=user.email, password=user.password, role_id=role.id)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return UserRead(id=db_user.id, username=db_user.username, email=db_user.email, role=role.name)


@router.post("/login", response_model=UserRead)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter((User.username == user.username) & (User.password == user.password)).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Неправильный пароль или логин!")

    return{
        "id": db_user.id,
        "username": db_user.username,
        "email": db_user.email,
        "role": db_user.role.name
    }