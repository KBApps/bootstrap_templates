from fastapi import FastAPI
from .db import get_db

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "FastAPI + MongoDB is alive!"}

@app.get("/check-db")
async def check_db():
    db = get_db()
    result = await db.command("ping")
    return {"db_status": result}
