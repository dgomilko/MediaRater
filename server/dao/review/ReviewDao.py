from dao.dao import Dao
from extensions import db
from dao.model_mappers import review_mapper

class ReviewDao(Dao):
  @staticmethod
  def add_product_review(
    review_data: dict,
    model: db.Model
  ) -> dict:
    review = model(**review_data)
    db.session.add(review)
    success = super(ReviewDao, ReviewDao).commit()
    return {**review_data, 'id': review.id} if success else None
  
  @staticmethod
  def get_product_ratings(model: db.Model) -> list[tuple]:
    return model.query.with_entities(
      model.product_id,
      model.user_id,
      model.rate
    ).all()

  @staticmethod
  def get_review_by_id(rid: str, model: db.Model) -> dict:
    result = super(ReviewDao, ReviewDao).get_by_id(model, rid)
    return review_mapper(result) if result else None

  @staticmethod
  def alredy_reviewed(
    uid: str,
    pid: str,
    model: db.Model
  ) -> dict:
    result = model.query \
      .filter_by(user_id=uid, product_id=pid) \
      .first()
    return review_mapper(result) if result else None
