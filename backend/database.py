"""Database connection and session management."""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import os
from typing import Generator

# Get database URL from environment or use SQLite for development
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./test.db"
)

# Create engine based on database type
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
else:
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        pool_pre_ping=True,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator:
    """Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables and run migrations."""
    from models import Base
    from sqlalchemy import inspect, text
    
    # Run standard table creation
    Base.metadata.create_all(bind=engine)
    
    # Manual migration for is_preview column if it's missing (Post Hoc check)
    with engine.connect() as conn:
        inspector = inspect(engine)
        columns = [c["name"] for c in inspector.get_columns("form_submissions")]
        if "is_preview" not in columns:
            print("Migration: Adding is_preview column to form_submissions...")
            try:
                conn.execute(text("ALTER TABLE form_submissions ADD COLUMN is_preview BOOLEAN DEFAULT 0"))
                conn.commit()
            except Exception as e:
                print(f"Migration error: {e}")
