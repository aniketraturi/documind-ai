from sqlalchemy.orm import Session

from app.core.errors import bad_request_error
from app.core.security import hash_password
from app.repositories.user_repository import create_user, get_user_by_email
from app.schemas.auth import RegisterRequest


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