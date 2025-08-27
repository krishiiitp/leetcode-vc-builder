from fastapi import APIRouter, Depends, HTTPException
from core.database import get_db
from sqlalchemy.orm import Session
from auth.services.auth_service import get_current_active_user
from user.models.user import User
from contest.services.contest_service import fetch_problems, select_problems

contest_router = APIRouter(
    prefix='/contests',
    tags=['Contests']
)

@contest_router.post("/build/{topic}")
async def build_contest(topic: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    all_problems = await fetch_problems(topic)
    
    if not all_problems:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No problems found for topic '{topic}'."
        )

    contest_problems = select_problems(all_problems)
    
    new_contest = Contest(
        user_id=current_user.id,
        topic=topic,
        problems=list(contest_problems.values())
    )
    db.add(new_contest)
    db.commit()
    db.refresh(new_contest)

    return {
        "message": "Contest built successfully!",
    }


