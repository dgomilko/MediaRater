from db.database import db
from db.mixins import IntIdMixin, StrIdMixin, ProductMixin, ReviewMixin

movie_genres = db.Table(
    'movie_genres',
    db.Column('product_id', db.ForeignKey('media_products.id'), primary_key=True),
    db.Column("genre_id", db.ForeignKey('genres.id'), primary_key=True),
)

class MediaProduct(IntIdMixin, db.Model):
  __tablename__ = 'media_products'
  title = db.Column(db.String(150), nullable=False)
  release = db.Column(db.String(30), nullable=False)
  img_path = db.Column(db.String(300), nullable=False)
  synopsis = db.Column(db.Text, nullable=False)
  genres = db.relationship(
    'Genre',
    secondary=movie_genres,
    backref='content'
  )

class Genre(IntIdMixin, db.Model):
  __tablename__ = 'genres'
  name = db.Column(db.String(50), nullable=False, unique=True)

class Movie(ProductMixin, db.Model):
  __tablename__ = 'movies'
  runtime = db.Column(db.String(20), nullable=False)
  director = db.Column(db.String(100), nullable=False)

class Book(ProductMixin, db.Model):
  __tablename__ = 'books'
  pages = db.Column(db.String(5), nullable=False)
  author = db.Column(db.String(100), nullable=False)

class Show(ProductMixin, db.Model):
  __tablename__ = 'shows'
  seasons = db.Column(db.Integer, nullable=False)
  episodes = db.Column(db.Integer, nullable=False)

class User(StrIdMixin, db.Model):
  __tablename__ = 'users'
  name = db.Column(db.String(50), nullable=False)
  email = db.Column(db.String(100), unique=True)
  movie_reviews = db.relationship(
    'MovieReview',
    back_populates='user'
  )
  book_reviews = db.relationship(
    'BookReview',
    back_populates='user'
  )
  show_reviews = db.relationship(
    'ShowReview',
    back_populates='user'
  )

class MovieReview(ReviewMixin, db.Model):
  __tablename__ = 'movie_reviews'
  movie_id = db.Column(
    db.String(22),
    db.ForeignKey('movies.id')
  )
  movie = db.relationship(
    'Movie',
    back_populates='reviews',
    uselist=False
  )

class BookReview(ReviewMixin, db.Model):
  __tablename__ = 'book_reviews'
  book_id = db.Column(
    db.String(22),
    db.ForeignKey('books.id')
  )
  book = db.relationship(
    'Book',
    back_populates='reviews',
    uselist=False
  )

class ShowReview(ReviewMixin, db.Model):
  __tablename__ = 'show_reviews'
  show_id = db.Column(
    db.String(22),
    db.ForeignKey('shows.id')
  )
  show = db.relationship(
    'Show',
    back_populates='reviews',
    uselist=False
  )
