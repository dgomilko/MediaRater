from dao.dao import Dao
from db.database import db
from db.models import User
from db.structs import UserType

class UserDao(Dao):

  @staticmethod
  def add_user(user_data: UserType) -> bool:
    user = User(
      name=user_data.name,
      email=user_data.email
    )
    db.session.add(user)
    return super(UserDao, UserDao).commit()

  @staticmethod
  def get_by_id(uid: str) -> UserType:
    result = super(UserDao, UserDao).get_by_id(User, uid)
    return UserType(name=result.name, email=result.email)
