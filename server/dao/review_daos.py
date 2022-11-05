from dao.dao import Dao
from extensions import db
from db.models import BookReview, MovieReview, ShowReview
from db.structs import ReviewType

class ReviewDao(Dao):
  @staticmethod
  def add_product_review(review_data: ReviewType, model: db.Model) -> bool:
    review = model(
      user_id=review_data.user_id,
      text=review_data.text,
      rate=review_data.rate,
      product_id=review_data.product_id
    )
    db.session.add(review)
    return super(ReviewDao, ReviewDao).commit()
  
  @staticmethod
  def get_product_ratings(model: db.Model) -> list[tuple]:
    return model.query.with_entities(
      model.product_id,
      model.user_id,
      model.rate
    ).all()

  @staticmethod
  def get_review_by_id(rid: str, model: db.Model) -> ReviewType:
    result = super(ReviewDao, ReviewDao).get_by_id(model, rid)
    return ReviewType(
      rate=result.rate
    )

def review_dao_factory(name: str, model: db.Model):
  methods = {
    'add_new': staticmethod(lambda data: ReviewDao
      .add_product_review(data, model)),
    'get_ratings': staticmethod(lambda: ReviewDao
      .get_product_ratings(model)),
    'get_by_id': staticmethod(lambda id: ReviewDao
      .get_review_by_id(id, model))
  }
  return type(name, (ReviewDao,), methods)

MovieReviewDao = review_dao_factory('MovieReviewDao', MovieReview)
BookReviewDao = review_dao_factory('BookReviewDao', BookReview)
ShowReviewDao = review_dao_factory('ShowReviewDao', ShowReview)
