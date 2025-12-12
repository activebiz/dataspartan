from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import router
from app.init_db import init_db, seed_db

app = FastAPI(title="Book Catalog API", debug=settings.debug)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, tags=["catalog"])


@app.on_event("startup")
def on_startup():
    init_db()
    try:
        seed_db()
    except Exception:
        pass


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/")
async def root():
    return {"message": "Book Catalog API", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(settings.port),
        reload=False,
    )
