from sqlalchemy.orm import Session

from app.core.errors import bad_request_error, unauthorized_error
from app.core.security import create_access_token, hash_password, verify_password
from app.repositories.user_repository import create_user, get_user_by_email
from app.schemas.auth import LoginRequest, RegisterRequest


def register_user(db: Session, request: RegisterRequest):
    existing_user = get_user_by_email(db, request.email)

    if existing_user:
        raise bad_request_error("Email is already registered")

    hashed_password = hash_password(request.password)

    user = create_user(
        db,
        email=request.email,
        hashed_password=hashed_password,
        full_name=request.full_name,
    )

    return user


def login_user(db: Session, request: LoginRequest):
    user = get_user_by_email(db, request.email)

    if not user:
        raise unauthorized_error("Invalid email or password")

    if not verify_password(request.password, user.hashed_password):
        raise unauthorized_error("Invalid email or password")

    access_token = create_access_token(subject=str(user.id))

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }