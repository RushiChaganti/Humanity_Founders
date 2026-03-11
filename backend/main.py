"""Main FastAPI application for the Safety Form Engine."""

import uuid
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from database import get_db, init_db
from models import FormSchema, FormSubmission
from schemas import (
    FormSchemaCreate,
    FormSchemaUpdate,
    FormSchemaResponse,
    FormSubmissionCreate,
    FormSubmissionResponse,
    BranchesResponse,
    BranchInfo,
)
from logic_engine import LogicEngine

# Initialize database
init_db()

# Create FastAPI app
app = FastAPI(
    title="Safety Form Engine API",
    description="Dynamic form engine with conditional logic",
    version="0.1.0",
)

# Configure CORS
import os
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:8000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


# ===== FORM SCHEMA ENDPOINTS =====


@app.get("/api/forms", response_model=List[FormSchemaResponse])
def get_all_forms(db: Session = Depends(get_db)):
    """Get all latest versions of each form."""
    # This query gets the latest version for each form branch
    # For simplicity in this SQLite/PostgreSQL compatible way, we'll get all forms
    # and filter in Python, or use a more complex SQL query.
    # In a real app with many forms, we'd use a more optimized query.
    all_forms = db.query(FormSchema).order_by(desc(FormSchema.version)).all()
    
    # Group by root form (those with parent_id=None are roots)
    # or if we want all versions, we just return all_forms.
    # Let's return the latest version of each "branch"
    latest_versions = {}
    for form in all_forms:
        # Find root ID
        root_id = form.id
        current = form
        while current.parent_id:
            parent = db.query(FormSchema).filter(FormSchema.id == current.parent_id).first()
            if not parent:
                break
            current = parent
            root_id = current.id
            
        if root_id not in latest_versions or form.version > latest_versions[root_id].version:
            latest_versions[root_id] = form
            
    return list(latest_versions.values())



@app.get("/api/forms/{form_id}/branches", response_model=BranchesResponse)
def get_form_branches(form_id: str, db: Session = Depends(get_db)):
    """Get all branches (versions) of a form."""
    # Find the root form (either this ID or its root ancestor)
    form = db.query(FormSchema).filter(FormSchema.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    # Find root by traversing up
    root = form
    while root.parent_id:
        root = (
            db.query(FormSchema).filter(FormSchema.id == root.parent_id).first()
        )
        if not root:
            break

    # Get all descendants
    def get_all_descendants(parent_id: str) -> List[FormSchema]:
        children = db.query(FormSchema).filter(
            FormSchema.parent_id == parent_id
        ).all()
        all_descendants = list(children)
        for child in children:
            all_descendants.extend(get_all_descendants(child.id))
        return all_descendants

    all_forms = [root] + get_all_descendants(root.id)
    all_forms.sort(key=lambda x: x.version)

    branches = [
        BranchInfo(
            id=f.id,
            parent_id=f.parent_id,
            version=f.version,
            title=f.title,
            is_published=f.is_published,
            created_at=f.created_at,
            updated_at=f.updated_at,
        )
        for f in all_forms
    ]

    return BranchesResponse(root_id=root.id, branches=branches)


@app.get("/api/forms/{form_id}", response_model=FormSchemaResponse)
def get_form(form_id: str, db: Session = Depends(get_db)):
    """Get a specific form schema."""
    form = db.query(FormSchema).filter(FormSchema.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return form


@app.post("/api/forms", response_model=FormSchemaResponse, status_code=201)
def create_form(
    form_data: FormSchemaCreate, db: Session = Depends(get_db)
):
    """Create a new form schema."""
    form_id = str(uuid.uuid4())
    
    new_form = FormSchema(
        id=form_id,
        parent_id=None,
        version=1,
        title=form_data.title,
        description=form_data.description,
        fields=[field.model_dump() for field in form_data.fields],
        logic_rules=[rule.model_dump() for rule in form_data.logic_rules],
        is_published=False,
    )
    
    db.add(new_form)
    db.commit()
    db.refresh(new_form)
    return new_form


@app.post("/api/forms/{form_id}/version", response_model=FormSchemaResponse, status_code=201)
def create_form_version(
    form_id: str,
    form_data: FormSchemaUpdate,
    db: Session = Depends(get_db),
):
    """Create a new version of a form."""
    parent_form = db.query(FormSchema).filter(FormSchema.id == form_id).first()
    if not parent_form:
        raise HTTPException(status_code=404, detail="Form not found")

    # Find highest version in this branch
    max_version = db.query(FormSchema).filter(
        FormSchema.parent_id == parent_form.id
    ).count()
    
    # Also check if parent is a child (to calculate proper versioning)
    root = parent_form
    while root.parent_id:
        root = db.query(FormSchema).filter(FormSchema.id == root.parent_id).first()

    all_versions = db.query(FormSchema).filter(
        (FormSchema.id == root.id) | (FormSchema.parent_id == root.id)
    ).all()
    next_version = max([v.version for v in all_versions]) + 1

    new_form = FormSchema(
        id=str(uuid.uuid4()),
        parent_id=parent_form.id,
        version=next_version,
        title=form_data.title or parent_form.title,
        description=form_data.description or parent_form.description,
        fields=[field.model_dump() for field in (form_data.fields or parent_form.fields)] if form_data.fields else parent_form.fields,
        logic_rules=[rule.model_dump() for rule in (form_data.logic_rules or parent_form.logic_rules)] if form_data.logic_rules else parent_form.logic_rules,
        is_published=False,
    )

    db.add(new_form)
    db.commit()
    db.refresh(new_form)
    return new_form

@app.delete("/api/forms/{form_id}", status_code=204)
def delete_form(form_id: str, db: Session = Depends(get_db)):
    """Delete a form and all its versions."""
    form = db.query(FormSchema).filter(FormSchema.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    # In a real app, we might want to also delete all descendants or have a soft delete
    # For now, let's just delete this specific one
    db.delete(form)
    db.commit()
    return None

@app.put("/api/forms/{form_id}", response_model=FormSchemaResponse)
def update_form(
    form_id: str,
    form_data: FormSchemaUpdate,
    db: Session = Depends(get_db),
):
    """Update an unpublished form schema."""
    form = db.query(FormSchema).filter(FormSchema.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    if form.is_published and (form_data.fields is not None or form_data.logic_rules is not None):
        raise HTTPException(
            status_code=400,
            detail="Cannot edit fields or rules of published forms. Create a new version instead.",
        )

    if form_data.title is not None:
        form.title = form_data.title
    if form_data.description is not None:
        form.description = form_data.description
    if form_data.fields is not None:
        form.fields = [field.model_dump() for field in form_data.fields]
    if form_data.logic_rules is not None:
        form.logic_rules = [rule.model_dump() for rule in form_data.logic_rules]
    if form_data.is_published is not None:
        form.is_published = form_data.is_published

    db.commit()
    db.refresh(form)
    return form



# ===== FORM SUBMISSION ENDPOINTS =====


@app.post("/api/submissions", response_model=FormSubmissionResponse, status_code=201)
def create_submission(
    submission_data: FormSubmissionCreate,
    db: Session = Depends(get_db),
):
    """Submit a form response."""
    # Verify form exists
    form = db.query(FormSchema).filter(
        FormSchema.id == submission_data.schema_id
    ).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    # Validate responses against form schema
    field_ids = {field.get("id") for field in form.fields}
    for response_field_id in submission_data.responses.keys():
        if response_field_id not in field_ids:
            raise HTTPException(
                status_code=400,
                detail=f"Unknown field: {response_field_id}",
            )

    # Check required fields
    required_field_ids = {
        field.get("id")
        for field in form.fields
        if field.get("required", False)
    }
    
    # Apply logic rules to determine actual required and visible fields
    from schemas import LogicRule
    rules = [LogicRule(**rule) for rule in form.logic_rules]
    
    all_field_ids = {field.get("id") for field in form.fields}
    visible_fields = LogicEngine.get_visible_fields(
        rules, submission_data.responses, all_field_ids
    )
    
    actual_required = LogicEngine.get_required_fields(
        rules, submission_data.responses, required_field_ids
    )
    
    # Only require fields that are both required AND visible
    enforced_requirements = actual_required & visible_fields

    missing_required = enforced_requirements - set(submission_data.responses.keys())
    if missing_required:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required fields: {', '.join(missing_required)}",
        )

    # Create submission
    submission = FormSubmission(
        id=str(uuid.uuid4()),
        schema_id=submission_data.schema_id,
        responses=submission_data.responses,
        is_preview=submission_data.is_preview,
    )

    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


@app.get("/api/submissions/{submission_id}", response_model=FormSubmissionResponse)
def get_submission(submission_id: str, db: Session = Depends(get_db)):
    """Get a specific submission."""
    submission = db.query(FormSubmission).filter(
        FormSubmission.id == submission_id
    ).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission


@app.get("/api/forms/{form_id}/submissions")
def get_form_submissions(form_id: str, db: Session = Depends(get_db)):
    """Get all submissions for a form."""
    form = db.query(FormSchema).filter(FormSchema.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    submissions = (
        db.query(FormSubmission)
        .filter(FormSubmission.schema_id == form_id)
        .order_by(desc(FormSubmission.submitted_at))
        .all()
    )

    return {
        "form_id": form_id,
        "count": len(submissions),
        "submissions": [
            FormSubmissionResponse.model_validate(sub) for sub in submissions
        ],
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
