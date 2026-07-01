from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from core.database import get_db

router = APIRouter()

class PurchaseRequest(BaseModel):
    item_id: str
    office_id: str

@router.get("/{office_id}/balance")
def get_balance(office_id: str, db: Session = Depends(get_db)):
    """Fetch total treasury balance."""
    # MVP: Mocked return for sprint. Real implementation sums LedgerTransactions.
    return {"balance": 45231.00, "currency": "CREDITS"}

@router.get("/items")
def list_marketplace_items(db: Session = Depends(get_db)):
    """Return all purchasable assets (Desks, AI Agents, Decor)."""
    return [
        {"id": "item_01", "name": "Executive Desk", "price": 500, "category": "FURNITURE"},
        {"id": "item_02", "name": "AI Analyst Model", "price": 2000, "category": "AI_AGENT"},
        {"id": "item_03", "name": "Server Rack V2", "price": 1200, "category": "UPGRADE"}
    ]

@router.post("/purchase")
def execute_purchase(req: PurchaseRequest, db: Session = Depends(get_db)):
    """Process a transaction and trigger map placement intent."""
    # Deduct funds logic here
    # Emit WS event to spawn item
    return {"success": True, "item": req.item_id, "remaining_balance": 44731.00}
