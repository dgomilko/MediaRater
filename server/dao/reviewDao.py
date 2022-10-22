from dao.dao import Dao
from db.database import db
from db.models import MovieReview
from db.structs import ReviewType

class MovieReviewDao(Dao):

  @staticmethod
  def add_movie_review(review_data: ReviewType) -> bool:
    review = MovieReview(
      user_id=review_data.user_id,
      movie_id=review_data.product_id,
      text=review_data.text,
      rate=review_data.rate
    )
    db.session.add(review)
    return super(MovieReviewDao, MovieReviewDao).commit()
  
  @staticmethod
  def get_ratings() -> list[tuple]:
    return MovieReview.query.with_entities(
      MovieReview.movie_id,
      MovieReview.user_id,
      MovieReview.rate
    ).all()

  @staticmethod
  def get_review_by_id(rid: str) -> ReviewType:
    result = super(MovieReviewDao, MovieReviewDao).get_by_id(MovieReview, rid)
    return ReviewType(
      rate=result.rate
    )

