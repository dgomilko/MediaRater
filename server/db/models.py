from pydoc import synopsis
from db.database import db
from utils import generate_key

movie_genres = db.Table(
    'movie_genres',
    db.Column('product_id', db.ForeignKey('media_products.id'), primary_key=True),
    db.Column("genre_id", db.ForeignKey('genres.id'), primary_key=True),
)

class MediaProduct(db.Model):
  __tablename__ = 'media_products'
  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String(100), nullable=False)
  release = db.Column(db.String(30), nullable=False)
  img_path = db.Column(db.String(300), nullable=False)
  synopsis = db.Column(db.Text, nullable=False)
  genres = db.relationship(
    'Genre',
    secondary=movie_genres,
    backref='content'
  )

class Genre(db.Model):
  __tablename__ = 'genres'
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(50), nullable=False, unique=True)

class Movie(db.Model):
  __tablename__ = 'movies'
  id = db.Column(
    db.String(22),
    primary_key=True,
    autoincrement=False,
    default=generate_key
  )
  product_id = db.Column(
    db.Integer,
    db.ForeignKey('media_products.id'),
    nullable=True
  )
  product = db.relationship(
    'MediaProduct',
    backref=db.backref('movies', uselist=False)
  )
  runtime = db.Column(db.String(20), nullable=False)
  director = db.Column(db.String(100), nullable=False)
  reviews = db.relationship(
    'MovieReview',
    back_populates='movie'
  )

class User(db.Model):
  __tablename__ = 'users'
  id = db.Column(
    db.String(22),
    primary_key=True,
    autoincrement=False,
    default=generate_key
  )
  name = db.Column(db.String(50), nullable=False)
  email = db.Column(db.String(100), unique=True)
  movie_reviews = db.relationship(
    'MovieReview',
    back_populates='user'
  )

class MovieReview(db.Model):
  __tablename__ = 'movie_reviews'
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(
    db.String(22),
    db.ForeignKey('users.id')
  )
  user = db.relationship(
    'User',
    back_populates='movie_reviews',
    uselist=False
  )
  movie_id = db.Column(
    db.String(22),
    db.ForeignKey('movies.id')
  )
  movie = db.relationship(
    'Movie',
    back_populates='reviews',
    uselist=False
  )
  text = db.Column(db.Text, nullable=True)
  rate = db.Column(db.Integer, nullable=False)
