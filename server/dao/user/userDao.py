from dao.dao import Dao
from extensions import db
from db.models import User
from dao.model_mappers import user_mapper
from dao.reviews_loader import limit_per_page

class UserDao(Dao):

  @staticmethod
  def add_user(user_data: dict) -> dict:
    user = User(**user_data)
    db.session.add(user)
    success = super(UserDao, UserDao).commit()
    if not success: return None
    del user_data['password']
    return { **user_data, 'id': user.id }

  @staticmethod
  def get_by_email(user_email: str) -> dict:
    found = User.query.filter_by(email=user_email).first()
    return user_mapper(found) if found else None

  @staticmethod
  def get_by_id(uid: str) -> dict:
    result = super(UserDao, UserDao).get_by_id(User, uid)
    return user_mapper(result) if result else None

  @staticmethod
  @limit_per_page(10)
  def get_reviews(
    uid: str,
    page: int,
    attr: str
  ) -> tuple[list[dict], bool]:
    result = super(UserDao, UserDao).get_by_id(User, uid)
    return getattr(result, f'{attr}_reviews') if result else None

  @staticmethod
  def get_ids() -> list[str]:
    return [x[0] for x in User.query.with_entities(User.id).all()]
    
