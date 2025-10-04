"""Authentication utilities: password hashing and JWT creation/validation."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

import jwt
from passlib.context import CryptContext

from app.core.config import get_settings


settings = get_settings()
# Use pbkdf2_sha256 to avoid platform-specific bcrypt issues in tests
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

SECRET_KEY = settings.secret_key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    subject: str,
    expires_delta: Optional[timedelta] = None,
    extra_claims: Optional[Dict[str, Any]] = None,
) -> str:
    to_encode: Dict[str, Any] = {"sub": subject}
    if extra_claims:
        to_encode.update(extra_claims)
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Dict[str, Any]:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


# Very small in-memory user store for MVP/demo purposes
_USER_DB: Dict[str, Dict[str, Any]] = {}


def create_user(email: str, password: str) -> Dict[str, Any]:
    if email in _USER_DB:
        raise ValueError("User already exists")
    user = {"email": email, "password_hash": hash_password(password), "verified": False}
    _USER_DB[email] = user
    return user


def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    user = _USER_DB.get(email)
    if not user:
        return None
    if not verify_password(password, user["password_hash"]):
        return None
    return user


def get_user(email: str) -> Optional[Dict[str, Any]]:
    return _USER_DB.get(email)
