from fastapi import APIRouter
from .user import router as user_router
from .auth import router as auth_router

# from .user import router as user_router


def create_api_router(prefix: str = "/api") -> APIRouter:
    router = APIRouter(prefix=prefix)
    router.include_router(user_router, tags=["user"])

    router.include_router(auth_router, tags=["auth"])

    return router
