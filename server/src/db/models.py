from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.sql import func
from extensions import db
from security_utils.passwd_encryption import encrypt_passwd
from db.mixins import *

product_genres = db.Table(
    'product_genres',
    db.Column("genre_id", db.ForeignKey('genres.id'), primary_key=True),
    db.Column(
      'product_id',
      db.ForeignKey('media_products.id'),
      primary_key=True
    ),
)

class MediaProduct(IntIdMixin, db.Model):
  __tablename__ = 'media_products'
  title = db.Column(db.String(150), nullable=False)
  release = db.Column(db.String(30), nullable=False)
  img_path = db.Column(db.String(300), nullable=False)
  synopsis = db.Column(db.Text, nullable=False)
  genres = db.relationship(
    'Genre',
    secondary=product_genres,
    backref='content'
  )
  reviews = db.relationship(
    'Review',
    back_populates='product'
  )

class Genre(IntIdMixin, db.Model):
  __tablename__ = 'genres'
  name = db.Column(db.String(50), nullable=False, unique=True)

class Movie(ProductMixin, db.Model):
  __tablename__ = 'movies'
  runtime = db.Column(db.String(20), nullable=False)
  director = db.Column(db.String(100), nullable=False)
  reviews = db.relationship(
    'Review',
    secondary='media_products',
    primaryjoin='Movie.product_id == MediaProduct.id',
    secondaryjoin='Review.product_id == MediaProduct.id',
    viewonly=True,
    lazy='dynamic'
  )

class Book(ProductMixin, db.Model):
  __tablename__ = 'books'
  pages = db.Column(db.String(5), nullable=False)
  author = db.Column(db.String(100), nullable=False)
  reviews = db.relationship(
    'Review',
    secondary='media_products',
    primaryjoin='Book.product_id == MediaProduct.id',
    secondaryjoin='Review.product_id == MediaProduct.id',
    viewonly=True,
    lazy='dynamic'
  )

class Show(ProductMixin, db.Model):
  __tablename__ = 'shows'
  seasons = db.Column(db.Integer, nullable=False)
  episodes = db.Column(db.Integer, nullable=False)
  reviews = db.relationship(
    'Review',
    secondary='media_products',
    primaryjoin='Show.product_id == MediaProduct.id',
    secondaryjoin='Review.product_id == MediaProduct.id',
    viewonly=True,
    lazy='dynamic'
  )

class User(StrIdMixin, db.Model):
  __tablename__ = 'users'
  name = db.Column(db.String(50), nullable=False)
  email = db.Column(db.String(100), unique=True)
  _password = db.Column(db.String(100))
  country = db.Column(db.String(50))
  birthday = db.Column(db.DateTime)
  gender = db.Column(db.String(1))
  reviews = db.relationship(
    'Review',
    back_populates='user',
    lazy='dynamic'
  )
  # movie_reviews = db.relationship(
  #   'MovieReview',
  #   back_populates='user',
  #   lazy='dynamic'
  # )
  # book_reviews = db.relationship(
  #   'BookReview',
  #   back_populates='user',
  #   lazy='dynamic'
  # )
  # show_reviews = db.relationship(
  #   'ShowReview',
  #   back_populates='user',
  #   lazy='dynamic'
  # )

  @validates('gender')
  def validate_gender(self: db.Model, key: str, gender: str) -> str:
    assert gender in ['m', 'f']
    return gender

  @hybrid_property
  def password(self):
    return self._password

  @password.setter
  def password(self, password):
    self._password = encrypt_passwd(password)

class Review(IntIdMixin, db.Model):
  __tablename__ = 'reviews'
  text = db.Column(db.Text, nullable=True)
  rate = db.Column(db.Integer, nullable=False)
  created = db.Column(
    db.DateTime(timezone=True),
    default=func.now()
  )
  user_id = db.Column(
    db.String(22),
    db.ForeignKey('users.id')
  )
  user = db.relationship(
    'User',
    back_populates='reviews',
    uselist=False
  )
  product_id = db.Column(
    db.Integer,
    db.ForeignKey('media_products.id')
  )
  product = db.relationship(
    'MediaProduct',
    back_populates='reviews',
    uselist=False
  )

# class BookReview(ReviewMixin, db.Model):
#   __tablename__ = 'book_reviews'
#   product_id = db.Column(
#     db.String(22),
#     db.ForeignKey('books.id')
#   )
#   product = db.relationship(
#     'Book',
#     back_populates='reviews',
#     uselist=False
#   )

# class ShowReview(ReviewMixin, db.Model):
#   __tablename__ = 'show_reviews'
#   product_id = db.Column(
#     db.String(22),
#     db.ForeignKey('shows.id')
#   )
#   product = db.relationship(
#     'Show',
#     back_populates='reviews',
#     uselist=False
#   )

class BlacklistedToken(IntIdMixin, db.Model):
  __tablename__ = 'blacklisted_tokens'
  token = db.Column(db.String(500), unique=True, nullable=False)
  blacklisted_date = db.Column(
    db.DateTime,
    nullable=False,
    default=func.now()
  )
