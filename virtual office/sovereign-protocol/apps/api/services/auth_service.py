from sqlalchemy.orm import Session
from repositories.user_repository import UserRepository
from core.security import create_access_token
from fastapi import HTTPException

class AuthService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def register_user(self, email: str, name: str, password: str):
        existing_user = self.repo.get_by_email(email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # In a real app, hash password here
        new_user = self.repo.create(email=email, name=name)
        token = create_access_token(subject=new_user.id)
        return {"access_token": token, "token_type": "bearer"}

    def login_user(self, email: str, password: str):
        user = self.repo.get_by_email(email)
        if not user:
            raise HTTPException(status_code=400, detail="Incorrect credentials")
        
        token = create_access_token(subject=user.id)
        return {"access_token": token, "token_type": "bearer"}
