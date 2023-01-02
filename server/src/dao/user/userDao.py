from dao.dao import Dao
from extensions import db
from db.models import MediaProduct, User, Review, Movie, Book, Show
from dao.model_mappers import user_mapper
from dao.reviews_loader import limit_per_page, filter

class UserDao(Dao):
  types = {
    'movie': Movie,
    'show': Show,
    'book': Book
  }

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
  @filter
  def get_reviews(
    uid: str,
    page: int,
    product: str,
    min_rate: int = 0,
    max_rate: int = 5,
    filter: str = 'date',
    order: str = 'desc'
  ) -> tuple[list[dict], bool]:
    prod_model = UserDao.types[product]
    return db.session \
      .query(Review, prod_model.id) \
      .filter_by(user_id=uid) \
      .join(MediaProduct, MediaProduct.id == Review.product_id) \
      .join(prod_model, MediaProduct.id == prod_model.product_id)

  @staticmethod
  def count_reviews(uid: str, attr: str) -> int:
    result = super(UserDao, UserDao).get_by_id(User, uid)
    return len(list(
      Review.query.join(MediaProduct)
        .join(UserDao.types[attr]).all()
    )) if result else 0

  @staticmethod
  def get_ids() -> list[str]:
    return [x[0] for x in User.query.with_entities(User.id).all()]
