
from fastapi import FastAPI
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth
from app.db import engine
from app.db.engine import engine, SessionLocal
from app.db.base import Base

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"➡️  {request.method} {request.url.path}")
    response = await call_next(request)
    print(f"⬅️  {response.status_code} {request.url.path}")
    return response

# On startup, create the database tables
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

# Health check
@app.get("/health", tags=["Health"])
def healthcheck():
    return {"status": "ok"}

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
