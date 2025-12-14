from sqlalchemy import Integer, Column, String, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from database import Base


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, index=True, nullable=False)

    users = relationship("User", back_populates="role")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    role_id = Column(Integer, ForeignKey("roles.id"), index=True, nullable=False)
    role = relationship("Role", back_populates="users")

    tests = relationship("Test", back_populates="author")
    results = relationship("Result", back_populates="user")


class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True)
    title = Column(String, index=True, nullable=False)

    author_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    author = relationship("User", back_populates="tests")

    questions = relationship("Question", back_populates="test", cascade="all, delete-orphan")
    results = relationship("Result", back_populates="test")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)
    text = Column(Text, nullable=False)

    test_id = Column(Integer, ForeignKey("tests.id"), index=True, nullable=False)
    test = relationship("Test", back_populates="questions")

    options = relationship("Option", back_populates="question", cascade="all, delete-orphan")


class Option(Base):
    __tablename__ = "options"

    id = Column(Integer, primary_key=True)
    text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)

    question_id = Column(Integer, ForeignKey("questions.id"), index=True, nullable=False)
    question = relationship("Question", back_populates="options")


class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True)
    score = Column(Integer, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    test_id = Column(Integer, ForeignKey("tests.id"), index=True, nullable=False)

    user = relationship("User", back_populates="results")
    test = relationship("Test", back_populates="results")
