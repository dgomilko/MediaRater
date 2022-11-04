from dao.dao import Dao
from db.database import db
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

class MovieReviewDao(ReviewDao):
  @staticmethod
  def add_new(review_data: ReviewType) -> bool:
    return super(MovieReviewDao, MovieReviewDao) \
      .add_product_review(review_data, MovieReview)
  
  @staticmethod
  def get_ratings() -> list[tuple]:
    return super(MovieReviewDao, MovieReviewDao) \
      .get_product_ratings(MovieReview)

  @staticmethod
  def get_by_id(rid: str) -> ReviewType:
    return super(MovieReviewDao, MovieReviewDao) \
      .get_review_by_id(rid, MovieReview)

class BookReviewDao(ReviewDao):
  @staticmethod
  def add_new(review_data: ReviewType) -> bool:
    return super(BookReviewDao, BookReviewDao) \
      .add_product_review(review_data, BookReview)
  
  @staticmethod
  def get_ratings() -> list[tuple]:
    return super(BookReviewDao, BookReviewDao) \
      .get_product_ratings(BookReview)

  @staticmethod
  def get_by_id(rid: str) -> ReviewType:
    return super(BookReviewDao, BookReviewDao) \
      .get_review_by_id(rid, BookReview)

class ShowReviewDao(ReviewDao):
  @staticmethod
  def add_new(review_data: ReviewType) -> bool:
    return super(ShowReviewDao, ShowReviewDao) \
    .add_product_review(review_data, ShowReview)
  
  @staticmethod
  def get_ratings() -> list[tuple]:
    return super(ShowReviewDao, ShowReviewDao) \
      .get_product_ratings(ShowReview)

  @staticmethod
  def get_by_id(rid: str) -> ReviewType:
    return super(ShowReviewDao, ShowReviewDao) \
      .get_review_by_id(rid, ShowReview)