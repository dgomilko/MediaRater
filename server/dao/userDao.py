from dao.dao import Dao
from extensions import db
from db.models import User
from db.structs import UserType
from dao.review_mapper import get_reviews

class UserDao(Dao):

  @staticmethod
  def add_user(user_data: UserType) -> dict:
    user_dict = user_data.as_dict()
    user = User(**user_dict)
    db.session.add(user)
    success = super(UserDao, UserDao).commit()
    return { **user_dict, 'id': user.id } if success else None

  @staticmethod
  def get_by_email(user_email: str) -> dict:
    found = User.query.filter_by(email=user_email).first()
    return UserDao.__user_as_dict(found) if found is not None else None

  @staticmethod
  def get_by_id(uid: str) -> dict:
    result = super(UserDao, UserDao).get_by_id(User, uid)
    return UserDao.__user_as_dict(result) if result is not None else None

  @staticmethod
  def get_reviews(uid: str, attr: str) -> list[dict]:
    result = super(UserDao, UserDao).get_by_id(User, uid)
    if result is None: return result
    return get_reviews(getattr(result, f'{attr}_reviews'))

  @staticmethod
  def get_ids() -> list[str]:
    return [x[0] for x in User.query.with_entities(User.id).all()]
    
  __user_as_dict = lambda result: {
      'name': result.name,
      'email': result.email,
      'birthday': result.birthday,
      'country': result.country,
      'gender': result.gender,
      'password': result.password
    }
