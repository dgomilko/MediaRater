from dao.dao import Dao
from extensions import db
from db.structs import ReviewType

class ReviewDao(Dao):
  @staticmethod
  def add_product_review(
    review_data: ReviewType,
    model: db.Model
  ) -> dict:
    dict_data = review_data.as_dict()
    review = model(**dict_data)
    db.session.add(review)
    success = super(ReviewDao, ReviewDao).commit()
    return {**dict_data, 'id': review.id} if success else None
  
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
