from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from database import get_db
from models import Test, Question, Option, User, Result
from schemas import TestCreate, TestRead, TestSubmitCreate, ResultRead

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
    tests = db.query(Test).options(joinedload(Test.questions), joinedload(Test.author)).all()
    return tests


@router.get("/publictest/{test_id}", response_model=TestRead)
def get_test(test_id: int, db: Session = Depends(get_db)):
    test = db.query(Test).options(joinedload(Test.questions).joinedload(Question.options)).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Тест не найден")
    return test


@router.post("/publictest/submit", response_model=ResultRead)
def submit_test(payload: TestSubmitCreate, db: Session = Depends(get_db)):
    test = db.query(Test).options(joinedload(Test.questions).joinedload(Question.options)).filter(Test.id == payload.test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Тест не найден")

    if len(payload.answers) != len(test.questions):
        raise HTTPException(status_code=400, detail="Ответы даны не на все вопросы")

    score = 0
    for answer in payload.answers:
        question = next((q for q in test.questions if q.id == answer.question_id), None)
        if question:
            option = next((o for o in question.options if o.id == answer.option_id), None)
            if option and option.is_correct:
                score += 1

    db_result = Result(test_id=payload.test_id, user_id=payload.user_id, score=score)
    db.add(db_result)
    db.commit()
    db.refresh(db_result)

    return {"score": score, "total": len(test.questions)}


@router.get("/tests/{user_id}", response_model=List[TestRead])
def get_my_tests(user_id: int, db: Session = Depends(get_db)):
    test = db.query(Test).options(joinedload(Test.questions).joinedload(Question.options)).filter(Test.author_id == user_id).all()
    return test