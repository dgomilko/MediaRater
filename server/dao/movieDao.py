from sqlalchemy.exc import IntegrityError
from dao.dao import Dao
from db.database import db
from db.models import MediaProduct, Movie, Genre, movie_genres
from db.structs import MovieType

class MovieDao(Dao):

  @staticmethod
  def add_movie(film_data: MovieType) -> bool:
    genres = MovieDao.__insert_new_genres(film_data.genres)
    product = MediaProduct(
      title=film_data.title,
      release=film_data.release,
      img_path=film_data.img_path
    )
    movie = Movie(product=product, runtime=film_data.runtime)
    db.session.add(movie)
    db.session.flush()
    for genre in genres:
      statement = movie_genres.insert().values(
        product_id=movie.product.id,
        genre_id=genre['id']
      )
      db.session.execute(statement)
    return super(MovieDao, MovieDao).commit()

  @staticmethod
  def get_movie_by_id(pid: str) -> MovieType:
    result = super(MovieDao, MovieDao).get_by_id(Movie, pid)
    return MovieType(
      title=result.product.title,
      release=result.product.release,
      img_path=result.product.img_path,
      genres=[genre.name for genre in result.product.genres],
      runtime=result.runtime
    )

  def __insert_new_genres(genres: list[str]) -> list[dict]:
    result = list()
    for genre_name in genres:
      db.session.begin_nested()
      genre = Genre(name=genre_name)
      db.session.add(genre)
      try:
        db.session.flush()
      except IntegrityError:
        db.session.rollback()
        genre = Genre.query.filter_by(name=genre_name).first()
      result.append({'name': genre.name, 'id': genre.id})
    return result