import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker

# Expect POSTGRES_URL in env, otherwise fallback to local postgres (for dev)
POSTGRES_URL = os.getenv(
    "POSTGRES_URL", 
    "postgresql+asyncpg://postgres:postgres@localhost:5432/virtual_office"
)

engine = create_async_engine(POSTGRES_URL, echo=True)

async_session_maker = sessionmaker(
    bind=engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with async_session_maker() as session:
        yield session
