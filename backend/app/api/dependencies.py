from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.errors import unauthorized_error
from app.core.security import decode_access_token
from app.db.database import get_db
from app.models.user import User
from app.repositories.user_repository import get_user_by_id

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials

    payload = decode_access_token(token)

    if payload is None:
        raise unauthorized_error("Invalid or expired token")

    user_id = payload.get("sub")

    if user_id is None:
        raise unauthorized_error("Invalid token")

    user = get_user_by_id(db, int(user_id))

    if user is None:
        raise unauthorized_error("User not found")

    return user