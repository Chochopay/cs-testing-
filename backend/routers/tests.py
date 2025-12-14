from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from database import get_db
from models import Test, Question, Option, User
from schemas import TestCreate, TestRead

router = APIRouter(prefix="/test", tags=["Test"])

@router.post("/create", response_model=TestRead)
def create_test(test: TestCreate, db: Session = Depends(get_db)):
    author = db.query(User).filter(User.id == test.author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Автор не найден")
    new_test = Test(title=test.title, author_id=test.author_id)
    db.add(new_test)
    db.flush()

    for q in test.questions:
        new_question = Question(text=q.text, test_id=new_test.id)
        db.add(new_question)
        db.flush()

        for opt in q.options:
            new_option = Option(text=opt.text, is_correct=opt.is_correct, question_id=new_question.id)
            db.add(new_option)

    db.commit()
    db.refresh(new_test)

    return new_test


@router.get("/publictest", response_model=List[TestRead])
def get_tests(db: Session = Depends(get_db)):
    tests = db.query(Test).options(joinedload(Test.questions).joinedload(Question.options), joinedload(Test.author)).all()
    return tests


