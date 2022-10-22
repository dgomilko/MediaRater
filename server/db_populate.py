import csv
from random import sample, randint
from dao.movieDao import MovieDao
from dao.userDao import UserDao
from dao.reviewDao import MovieReviewDao
from db.structs import MovieType, ReviewType, UserType
from db.models import MediaProduct, User, Movie

LIMIT = 300
PATH = './media_data/movies_dataset_from_allmovie.csv'

users = [
  UserType(name='user1', email='sada@gmail.com'),
  UserType(name='user2', email='adsad@gmail.com'),
  UserType(name='user3', email='oooo4234@gmail.com'),
  UserType(name='user4', email='ad___e@gmail.com')
]

def populate_with_movies():
  movies = list()
  with open(PATH) as csv_file:
    reader = csv.DictReader(csv_file)
    count = 0
    for row in reader:
      if count == LIMIT: break
      if not row['poster'] or not row['director']: continue
      count += 1
      movie_data = MovieType(
        title=row['name'],
        release=row['released_at'],
        img_path=row['poster'],
        runtime=row['duration'],
        genres=row['genre'].split(' ')
      )
      movies.append(movie_data)
      MovieDao.add_movie(movie_data)

    for user in users:
      UserDao.add_user(user)

    for user in users:
      db_user = User.query.filter_by(name=user.name).first()
      reiewed_movies = sample(movies, randint(0, 100))
      for movie in reiewed_movies:
        db_movie = Movie.query.join(MediaProduct).filter_by(title=movie.title).first()
        review_data = ReviewType(
          user_id=db_user.id,
          product_id=db_movie.id,
          rate=randint(0, 5)
        )
        MovieReviewDao.add_movie_review(review_data)

