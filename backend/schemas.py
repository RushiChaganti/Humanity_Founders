"""Pydantic models for API request/response validation."""

from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


# Field Definition Schemas
class FieldOption(BaseModel):
    """Option for select/radio fields."""
    label: str
    value: str


class FieldConfig(BaseModel):
    """Base field configuration."""
    id: str
    type: str  # text, textarea, select, radio, checkbox
    label: str
    required: bool = False
    placeholder: Optional[str] = None
    description: Optional[str] = None
    options: Optional[List[FieldOption]] = None
    validation_regex: Optional[str] = None
    max_length: Optional[int] = None


# Logic Rule Schemas
class LogicCondition(BaseModel):
    """Single condition in a rule."""
    field_id: str
    operator: str  # equals, contains, starts_with, is_empty, etc.
    value: Any


class LogicAction(BaseModel):
    """Action to apply when conditions are met."""
    field_id: str
    action: str  # show, hide, require, unrequire, style
    value: Optional[Any] = None


class LogicRule(BaseModel):
    """Conditional logic rule."""
    id: str
    name: str
    conditions: List[LogicCondition]
    condition_type: str = "all"  # all or any
    actions: List[LogicAction]


# Form Schema Schemas
class FormSchemaCreate(BaseModel):
    """Request to create a new form schema."""
    title: str
    description: Optional[str] = None
    category: Optional[str] = "general"
    fields: List[FieldConfig]
    logic_rules: List[LogicRule] = Field(default_factory=list)


class FormSchemaUpdate(BaseModel):
    """Request to update a form schema."""
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    fields: Optional[List[FieldConfig]] = None
    logic_rules: Optional[List[LogicRule]] = None
    is_published: Optional[bool] = None



class FormSchemaResponse(BaseModel):
    """Response containing form schema."""
    id: str
    parent_id: Optional[str] = None
    version: int
    title: str
    description: Optional[str] = None
    category: Optional[str] = "general"
    fields: List[FieldConfig]
    logic_rules: List[LogicRule]
    is_published: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Form Submission Schemas
class FormSubmissionCreate(BaseModel):
    """Request to submit a form."""
    schema_id: str
    responses: Dict[str, Any]
    is_preview: bool = False


class FormSubmissionResponse(BaseModel):
    """Response containing form submission."""
    id: str
    schema_id: str
    responses: Dict[str, Any]
    is_preview: bool
    submitted_at: datetime

    class Config:
        from_attributes = True


# Branch Response
class BranchInfo(BaseModel):
    """Information about a form schema branch."""
    id: str
    parent_id: Optional[str] = None
    version: int
    title: str
    is_published: bool
    created_at: datetime
    updated_at: datetime


class BranchesResponse(BaseModel):
    """Response containing all branches of a form."""
    root_id: str
    branches: List[BranchInfo]
