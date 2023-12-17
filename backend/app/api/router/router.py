from fastapi import APIRouter
from .user import router as user_router
from .auth import router as auth_router
from .profession import router as profession_router
from .course import router as course_router
from .stats import router as stats_router

# from .user import router as user_router


def create_api_router(prefix: str = "/api") -> APIRouter:
    router = APIRouter(prefix=prefix)

    router.include_router(user_router, tags=["user"])
    router.include_router(profession_router, tags=["profession"])
    router.include_router(auth_router, tags=["auth"])
    router.include_router(course_router, tags=["course"])
    router.include_router(stats_router, tags=["stats"])

    return router
