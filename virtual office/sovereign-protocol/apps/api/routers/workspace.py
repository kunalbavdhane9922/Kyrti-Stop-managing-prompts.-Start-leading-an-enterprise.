from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from core.database import get_db

router = APIRouter()

class ExpansionRequest(BaseModel):
    expansion_type: str
    anchor_x: int
    anchor_y: int

@router.get("/{office_id}/status")
def get_office_status(office_id: str, db: Session = Depends(get_db)):
    """Fetch the treasury, governance, and grid size of the office."""
    return {
        "office_id": office_id,
        "name": "Sovereign HQ",
        "budget": 50000,
        "grid_width": 30,
        "grid_height": 30
    }

@router.post("/{office_id}/expand")
def expand_office(office_id: str, req: ExpansionRequest, db: Session = Depends(get_db)):
    """Validates funds and issues Map Expansion Patch."""
    # MVP: Hardcoded success
    return {
        "success": True,
        "new_width": 40,
        "new_height": 40,
        "patch_applied": req.expansion_type
    }
