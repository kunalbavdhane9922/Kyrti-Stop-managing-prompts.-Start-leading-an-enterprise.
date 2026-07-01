from sqlalchemy.orm import Session
from models.user import User

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> User:
        return self.db.query(User).filter(User.email == email).first()

    def create(self, email: str, name: str) -> User:
        db_user = User(email=email, name=name)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
