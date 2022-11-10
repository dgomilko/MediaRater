from dao.dao import Dao
from extensions import db
from db.models import User
from db.structs import UserType
from dao.model_mappers import user_mapper
from dao.reviews_loader import limit_per_page

class UserDao(Dao):

  @staticmethod
  def add_user(user_data: UserType) -> dict:
    user_dict = user_data.as_dict()
    user = User(**user_dict)
    db.session.add(user)
    success = super(UserDao, UserDao).commit()
    if not success: return None
    del user_dict['password']
    return { **user_dict, 'id': user.id }

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
    # results_per_page = 10
    # offset = results_per_page * (page - 1)
    # limit = results_per_page * page
    result = super(UserDao, UserDao).get_by_id(User, uid)
    return getattr(result, f'{attr}_reviews') if result else None
    # if not result: return result
    # limited = getattr(result, f'{attr}_reviews') \
    #   .slice(offset, limit).all()
    # if not limited: return None
    # next_available = bool(getattr(result, f'{attr}_reviews')
    #   .slice(limit, limit + results_per_page).all())
    # return review_mapper(limited), next_available

  @staticmethod
  def get_ids() -> list[str]:
    return [x[0] for x in User.query.with_entities(User.id).all()]
    
