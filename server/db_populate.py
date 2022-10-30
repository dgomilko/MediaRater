import pandas as pd
from dataclasses import dataclass
from random import sample, randint
from dao.product_daos import *
from dao.userDao import UserDao
from dao.review_daos import *
from db.structs import *
from db.models import *

LIMIT = 20
MOVIES_PATH = './media_data/movies.csv'
BOOKS_PATH = './media_data/books.csv'
SHOWS_PATH = './media_data/shows.csv'

users = [
  UserType(
    name='user1',
    email='sada@gmail.com',
    country='GB',
    birthday='1990.08.12',
    password='asdkl34jk',
    gender='f'
  ),
  UserType(
    name='user2',
    email='adsad@gmail.com',
    country='Sweden',
    birthday='1999.10.14',
    password='asdkl34jk',
    gender='m'
  ),
  UserType(
    name='user3',
    email='oooo4234@gmail.com',
    country='Ukraine',
    birthday='2000.10.14',
    password='asdkl34jk',
    gender='m'
  ),
  UserType(
    name='user4',
    email='ad___e@gmail.com',
    country='Ukraine',
    birthday='2001.12.11',
    password='asdkl34jk',
    gender='f'
  )
]

db_details = {
  MOVIES_PATH: [Movie, MovieType, MovieDao, MovieReviewDao],
  BOOKS_PATH: [Book, BookType, BookDao, BookReviewDao],
  SHOWS_PATH: [Show, ShowType, ShowDao, ShowReviewDao]
}

def populate_product(
  path: str,
  product_type: dataclass,
  product_dao: ProductDao
) -> list[dataclass]:
  products = list()
  data = pd.read_csv(path, keep_default_na=False).T.to_dict()
  for row in list(data.values())[:LIMIT]:
    row['genres'] = row['genres'].split(', ') if len(row['genres']) else []
    product_data = product_type(**row)
    products.append(product_data)
    product_dao.add_new(product_data)
  return products

def populate_reviews(
  products: list[dataclass],
  review_dao: ReviewDao,
  product_model: any
):
  for user in users:
    db_user = User.query.filter_by(name=user.name).first()
    reiewed_products = sample(products, randint(0, 10))
    for product in reiewed_products:
      db_product = product_model.query.join(MediaProduct) \
        .filter_by(title=product.title).first()
      review_data = ReviewType(
        user_id=db_user.id,
        product_id=db_product.id,
        rate=randint(0, 5)
      )
      review_dao.add_new(review_data)

def populate_db():
  for user in users: UserDao.add_user(user)
  for path, (
    product_model, product_type, product_dao, review_dao
  ) in db_details.items():
    products = populate_product(path, product_type, product_dao)
    populate_reviews(products, review_dao, product_model)
