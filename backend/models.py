"""Database models for the Safety Form Engine."""

from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy import Column, String, Integer, DateTime, JSON, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class FormSchema(Base):
    """Form schema definition with versioning support."""
    __tablename__ = "form_schemas"

    id = Column(String(36), primary_key=True)
    parent_id = Column(String(36), ForeignKey("form_schemas.id"), nullable=True)
    version = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    category = Column(String(50), nullable=True, default="general")
    
    # JSONB field storing the form structure
    fields = Column(JSON, nullable=False)  # Array of field objects
    logic_rules = Column(JSON, nullable=False)  # Array of conditional rules
    
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    submissions = relationship("FormSubmission", back_populates="schema", cascade="all, delete-orphan")
    child_versions = relationship("FormSchema", remote_side=[parent_id], cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<FormSchema {self.id} v{self.version}>"


class FormSubmission(Base):
    """User submissions for forms."""
    __tablename__ = "form_submissions"

    id = Column(String(36), primary_key=True)
    schema_id = Column(String(36), ForeignKey("form_schemas.id"), nullable=False)
    
    # Form responses - map of field_id -> value
    responses = Column(JSON, nullable=False)
    
    # Metadata
    is_preview = Column(Boolean, default=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    schema = relationship("FormSchema", back_populates="submissions")
    
    def __repr__(self):
        return f"<FormSubmission {self.id}>"
