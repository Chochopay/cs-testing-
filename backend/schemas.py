from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

#Авторизация
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str
    teacher_code: Optional[str] = None

class UserRead(UserBase):
    id: int

    model_config = {"from_attributes": True}


class UserLogin(BaseModel):
    username: str
    password: str


#Тесты

class OptionCreate(BaseModel):
    text: str
    is_correct: bool = Field(..., alias="isCorrect")

class QuestionCreate(BaseModel):
    text: str
    options: List[OptionCreate]

class TestCreate(BaseModel):
    title: str
    questions: List[QuestionCreate]
    author_id: int

class OptionRead(BaseModel):
    id: int
    text: str
    is_correct: bool

    model_config = {"from_attributes": True}


class QuestionRead(BaseModel):
    id: int
    text: str
    options: List[OptionRead]

    model_config = {"from_attributes": True}


class AuthorRead(BaseModel):
    id: int
    username: str

    model_config = {"from_attributes": True}


class TestRead(BaseModel):
    id: int
    title: str
    questions: List[QuestionRead]
    author: AuthorRead

    model_config = {"from_attributes": True}


