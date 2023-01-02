from dao.dao import Dao
from extensions import db
from db.models import MediaProduct, Review, Movie, Book, Show
from dao.model_mappers import review_mapper

class ReviewDao(Dao):
  types = {
      'movie': Movie,
      'show': Show,
      'book': Book
    }

  @staticmethod
  def add_new(review_data: dict, product_model: str) -> dict:
    product = ReviewDao._get_product_id(
      product_model,
      review_data['product_id']
    )
    review = Review(**{
      **review_data,
      'product_id': product.product_id
    })
    db.session.add(review)
    success = super(ReviewDao, ReviewDao).commit()
    return {**review_data, 'id': review.id} if success else None
  
  @staticmethod
  def get_ratings(media_type: str) -> list[tuple]:
    model = ReviewDao.types[media_type]
    return Review.query.with_entities(
      model.id,
      Review.user_id,
      Review.rate
    ).join(MediaProduct, Review.product_id == MediaProduct.id) \
    .join(model, model.product_id == MediaProduct.id).all()

  @staticmethod
  def get_review_by_id(rid: str, model: db.Model) -> dict:
    result = super(ReviewDao, ReviewDao).get_by_id(model, rid)
    return review_mapper(result) if result else None

  @staticmethod
  def reviewed(
    uid: str,
    pid: str,
    prod_type: str 
  ) -> dict:
    product = ReviewDao._get_product_id(prod_type, pid)
    result = Review.query \
      .filter_by(user_id=uid, product_id=product.product_id) \
      .first()
    return {
      **review_mapper(result),
      'product_id': pid
    } if result else None

  def _get_product_id(model: str, pid: str):
    return ReviewDao.types[model].query.filter_by(id=pid).first()
