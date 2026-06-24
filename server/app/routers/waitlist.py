import csv
import io
import os
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.waitlist import WaitlistEntry
from app.schemas.waitlist import WaitlistCreate, WaitlistResponse, WaitlistStats

router = APIRouter(prefix="/api/waitlist", tags=["waitlist"])


def _get_admin_password() -> str:
    pw = os.getenv("P1G_WAITLIST_ADMIN_PASSWORD")
    if not pw:
        raise RuntimeError("P1G_WAITLIST_ADMIN_PASSWORD env var is not set")
    return pw


def verify_admin(x_admin_password: str = Header(...)):
    expected = _get_admin_password()
    if x_admin_password != expected:
        raise HTTPException(status_code=403, detail="Invalid admin password")


class AuthRequest(BaseModel):
    password: str


@router.post("/auth")
def authenticate(data: AuthRequest):
    expected = _get_admin_password()
    if data.password != expected:
        raise HTTPException(status_code=403, detail="Invalid admin password")
    return {"ok": True}


@router.post("", response_model=WaitlistResponse, status_code=201)
def create_entry(data: WaitlistCreate, db: Session = Depends(get_db)):
    interest = data.interest.lower()
    if interest not in ("buyer", "seller", "both"):
        raise HTTPException(status_code=422, detail="interest must be 'buyer', 'seller', or 'both'")

    entry = WaitlistEntry(name=data.name, email=data.email, phone=data.phone, interest=interest)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("", response_model=list[WaitlistResponse])
def list_entries(
    interest: str | None = None,
    sort: str = "desc",
    db: Session = Depends(get_db),
    _=Depends(verify_admin),
):
    q = db.query(WaitlistEntry)
    if interest:
        if interest == "both":
            q = q.filter(WaitlistEntry.interest == "both")
        else:
            q = q.filter(WaitlistEntry.interest.in_([interest, "both"]))
    order = WaitlistEntry.created_at.desc() if sort != "asc" else WaitlistEntry.created_at.asc()
    return q.order_by(order).all()


@router.get("/stats", response_model=WaitlistStats)
def get_stats(db: Session = Depends(get_db), _=Depends(verify_admin)):
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    total = db.query(func.count(WaitlistEntry.id)).scalar() or 0
    buyers = db.query(func.count(WaitlistEntry.id)).filter(
        WaitlistEntry.interest.in_(["buyer", "both"])
    ).scalar() or 0
    sellers = db.query(func.count(WaitlistEntry.id)).filter(
        WaitlistEntry.interest.in_(["seller", "both"])
    ).scalar() or 0
    today = db.query(func.count(WaitlistEntry.id)).filter(
        WaitlistEntry.created_at >= today_start
    ).scalar() or 0
    return WaitlistStats(total=total, buyers=buyers, sellers=sellers, today=today)


@router.get("/export")
def export_csv(
    db: Session = Depends(get_db),
    _=Depends(verify_admin),
):
    entries = db.query(WaitlistEntry).order_by(WaitlistEntry.created_at.desc()).all()
    out = io.StringIO()
    w = csv.writer(out)
    w.writerow(["Name", "Email", "Phone", "Interest", "Date Joined"])
    for e in entries:
        w.writerow([e.name, e.email, e.phone, e.interest, e.created_at.isoformat()])

    out.seek(0)
    filename = f"p1g-waitlist-{datetime.now(timezone.utc).strftime('%Y-%m-%d')}.csv"
    return StreamingResponse(
        iter([out.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
