import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


from .initializers import settings
from .api.router import create_api_router


@asynccontextmanager
async def lifespan(app: FastAPI):

    yield None
    # close ml models


def create_app() -> FastAPI:
    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
        filemode="w",
    )

    # db = Database(settings)
    app = FastAPI(
        title="IFoundMisis",
        version="0.0.1",
        description="Rest api for frontend Application",
        docs_url=f"{settings.api_prefix}/docs",
        openapi_url=f"{settings.api_prefix}/openapi.json",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_credentials=True,
        allow_headers=["*"],
    )

    # app.mount("/api/static", StaticFiles(directory="./backtests"), name="static")
    api_router = create_api_router(prefix=settings.api_prefix)

    app.include_router(api_router)
    return app
