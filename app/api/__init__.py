"""API router assembly for LACOSA."""
from fastapi import APIRouter

from app.api import (
    concierge,
    culture,
    housing,
    lifestyle,
    relocation,
    safety,
    schools,
    shopping,
    transport,
    users,
    utilities,
    utilities_stream,
)


router = APIRouter(prefix="/api")

router.include_router(utilities.router)
router.include_router(utilities_stream.router)
router.include_router(safety.router)
router.include_router(housing.router)
router.include_router(schools.router)
router.include_router(shopping.router)
router.include_router(lifestyle.router)
router.include_router(culture.router)
router.include_router(transport.router)
router.include_router(concierge.router)
router.include_router(relocation.router)
router.include_router(users.router)
