from database import Base, engine, SessionLocal
from models import Role
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, tests  # убедись, что tests.router существует

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tests.router)

def init_roles():
    with SessionLocal() as db:
        roles = ["admin", "teacher", "student"]
        for role in roles:
            if not db.query(Role).filter(Role.name == role).first():
                db.add(Role(name=role))
        db.commit()

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    init_roles()
    print("Таблицы и роли созданы")
