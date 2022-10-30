from dao.dao import Dao
from db.database import db
from db.models import User
from db.structs import UserType

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
    return UserDao.__user_as_dict(result)

  @staticmethod
  def get_reviews(uid: str, attr: str) -> list[dict]:
    result = super(UserDao, UserDao).get_by_id(User, uid)
    if result is None: return result
    return [{
      'text': r.text,
      'rate': r.rate,
      'author': r.user.name,
      'author_id': r.user_id,
      f'{attr}': getattr(r, attr).product.title,
      f'{attr}_id': getattr(r, f'{attr}_id')
    } for r in getattr(result, f'{attr}_reviews')]

  __user_as_dict = lambda result: {
      'name': result.name,
      'email': result.email,
      'birthday': result.birthday,
      'country': result.country,
      'gender': result.gender,
      'password': result.password
    }
