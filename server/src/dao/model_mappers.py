from datetime import date
from extensions import db

def stats_mapper(reviews: list[db.Model]) -> list[dict]:
  today = date.today()
  get_age = lambda b: today.year - b.year - \
    ((today.month, today.day) < (b.month, b.day))
  return [{
    'rate': r.rate,
    'country': r.user.country,
    'gender': r.user.gender,
    'age': get_age(r.user.birthday),
  } for r in reviews]

review_mapper = lambda r: {
  'id': r.id,
  'text': r.text,
  'rate': r.rate,
  'author': r.user.name,
  'author_id': r.user_id,
  'product': r.product.product.title,
  'product_id': r.product_id
}

product_short_mapper = lambda p: {
  'id': p.id,
  'title': p.product.title,
  'release': p.product.release,
  'img_path': p.product.img_path
}

product_mapper = lambda p: {
  **product_short_mapper(p),
  'synopsis': p.product.synopsis,
  'genres': [genre.name for genre in p.product.genres],
}

user_mapper = lambda u: {
  'id': u.id,
  'name': u.name,
  'email': u.email,
  'birthday': u.birthday,
  'country': u.country,
  'gender': u.gender,
  'password': u.password,
  'reviews': len(u.book_reviews.all() + u.show_reviews.all() + u.movie_reviews.all()),
}