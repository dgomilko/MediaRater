from dao.review.review_factory import review_dao_factory
from db.models import BookReview, MovieReview, ShowReview

MovieReviewDao = review_dao_factory('MovieReviewDao', MovieReview)
BookReviewDao = review_dao_factory('BookReviewDao', BookReview)
ShowReviewDao = review_dao_factory('ShowReviewDao', ShowReview)
