#!/usr/bin/env python3
"""
Database initialization script for the Safety Form Engine.
Run this once to set up the database schema.

Usage:
    python init_db.py
"""

from database import init_db, engine
from models import Base

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Database initialized successfully!")
    print(f"Tables created: {Base.metadata.tables.keys()}")
