import csv
from dataclasses import dataclass
from random import sample, randint
from dao.product_daos import BookDao, MovieDao, ProductDao, ShowDao
from dao.userDao import UserDao
from dao.review_daos import BookReviewDao, MovieReviewDao, ShowReviewDao
from db.structs import BookType, MovieType, ReviewType, ShowType, UserType
from db.models import Book, MediaProduct, Show, User, Movie

LIMIT = 100
PATH1 = './media_data/movies.csv'
PATH2 = './media_data/books.csv'
PATH3 = './media_data/shows.csv'

users = [
  UserType(name='user1', email='sada@gmail.com'),
  UserType(name='user2', email='adsad@gmail.com'),
  UserType(name='user3', email='oooo4234@gmail.com'),
  UserType(name='user4', email='ad___e@gmail.com')
]

def populate_product(
  path: str,
  product_type: dataclass,
  product_dao: ProductDao
):
  products = list()
  with open(path) as csv_file:
    reader = csv.DictReader(csv_file)
    count = 0
    for row in reader:
      if count == LIMIT: break
      count += 1
      row['genres'] = row['genres'].split(', ') if len(row['genres']) else []
      movie_data = product_type(**row)
      products.append(movie_data)
      product_dao.add_new(movie_data)
  return products

# def populate_with_movies():
#     movies = populate_product(PATH1, MovieType, MovieDao)

#     for user in users: UserDao.add_user(user)

#     for user in users:
#       db_user = User.query.filter_by(name=user.name).first()
#       reiewed_movies = sample(movies, randint(0, 100))
#       for movie in reiewed_movies:
#         db_movie = Movie.query.join(MediaProduct).filter_by(title=movie.title).first()
#         review_data = ReviewType(
#           user_id=db_user.id,
#           product_id=db_movie.id,
#           rate=randint(0, 5)
#         )
#         MovieReviewDao.add_new(review_data)

  
def populate_with_movies():
    movies = populate_product(PATH2, BookType, BookDao)

    for user in users: UserDao.add_user(user)
    
    for user in users:
      db_user = User.query.filter_by(name=user.name).first()
      reiewed_books = sample(movies, randint(0, 100))
      for book in reiewed_books:
        db_book = Book.query.join(MediaProduct).filter_by(title=book.title).first()
        review_data = ReviewType(
          user_id=db_user.id,
          product_id=db_book.id,
          rate=randint(0, 5)
        )
        BookReviewDao.add_new(review_data)


# def populate_with_movies():
#     movies = populate_product(PATH3, ShowType, ShowDao)

#     for user in users: UserDao.add_user(user)
    
#     for user in users:
#       db_user = User.query.filter_by(name=user.name).first()
#       reiewed_movies = sample(movies, randint(0, 100))
#       for movie in reiewed_movies:
#         db_movie = Show.query.join(MediaProduct).filter_by(title=movie.title).first()
#         review_data = ReviewType(
#           user_id=db_user.id,
#           product_id=db_movie.id,
#           rate=randint(0, 5)
#         )
#         ShowReviewDao.add_new(review_data)
