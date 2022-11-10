from extensions import db
from dao.review.ReviewDao import ReviewDao

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
