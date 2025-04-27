# app/routers/auth.py
from fastapi import APIRouter, HTTPException, Depends, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError, DataError

from uuid import uuid4

from app.auth.hash import hash_password, verify_password
from app.auth.jwt_handler import create_access_token, create_refresh_token, decode_access_token
from app.models.user import User
from app.schemas.user import UserCreate, UserRead
from app.dependencies import get_db

router = APIRouter()

@router.post("/register", response_model=UserRead)
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        # 1. Validate input fields
        if not user.username or not user.password:
            raise HTTPException(status_code=422, detail="Username and password are required")

        username = user.username.strip()
        password = user.password.strip()

        if len(username) < 3:
            raise HTTPException(status_code=422, detail="Username must be at least 3 characters")
        if len(password) < 6:
            raise HTTPException(status_code=422, detail="Password must be at least 6 characters")

        if " " in username:
            raise HTTPException(status_code=422, detail="Username cannot contain spaces")
        if username.lower() in ["admin", "root", "system"]:
            raise HTTPException(status_code=422, detail="Username not allowed")

        # 2. Check if username already exists (race condition-safe)
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")

        # 3. Create user object
        db_user = User(
            id=uuid4(),
            username=username,
            hashed_password=hash_password(password),
        )
        db.add(db_user)

        # 4. Try to commit
        db.commit()
        db.refresh(db_user)
        return db_user
    
    except HTTPException as e:
        # 🛡️ If we manually raised an HTTP error earlier, just re-raise it
        raise e
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Username already exists (db constraint)")
    except DataError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Invalid data format (possibly too long fields)")
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error. Please try again later.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected server error: {str(e)}")


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "uuid": str(user.id),
    }


@router.post("/refresh")
def refresh_token(refresh_token: str = Body(...), db: Session = Depends(get_db)):
    payload = decode_access_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    # optionally validate user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_access_token = create_access_token({"sub": user_id})
    return {"access_token": new_access_token}
