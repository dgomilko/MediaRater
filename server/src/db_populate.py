import pandas as pd
from random import sample, randint
from dao.product.product_daos import *
from dao.product.ProductDao import ProductDao
from dao.user.userDao import UserDao
from dao.review.ReviewDao import ReviewDao
from db.models import *

LIMIT = 50
SHOWS_PATH = './media_data/shows.csv'
MOVIES_PATH = './media_data/movies.csv'
BOOKS_PATH = './media_data/books.csv'

users = [
  {
    'name': 'user1',
    'email': 'sada@gmail.com',
    'country': 'GB',
    'birthday': '1990.08.12',
    'password': 'asdkl34jk',
    'gender': 'f'
  },
  {
    'name': 'user2',
    'email': 'adsad@gmail.com',
    'country': 'Sweden',
    'birthday': '1999.10.14',
    'password': 'asdkl34jk',
    'gender': 'm'
  },
  {
    'name': 'user3',
    'email': 'oooo4234@gmail.com',
    'country': 'Ukraine',
    'birthday': '2000.10.14',
    'password': 'asdkl34jk',
    'gender': 'm'
  },
  {
    'name': 'user4',
    'email': 'ad___e@gmail.com',
    'country': 'Ukraine',
    'birthday': '2001.12.11',
    'password': 'asdkl34jk',
    'gender': 'f'
  },
  {
    'name': 'user5',
    'email': 'ad_fds__e@gmail.com',
    'country': 'Ukraine',
    'birthday': '2000.12.11',
    'password': 'asdkl34jk',
    'gender': 'f'
  },
  {
    'name': 'user6',
    'email': 'ad_fds_d_e@gmail.com',
    'country': 'Ukraine',
    'birthday': '2000.12.11',
    'password': 'asdkl34jk',
    'gender': 'm'
  },
  {
    'name': 'user7',
    'email': 'afds_d_e@gmail.com',
    'country': 'Ukraine',
    'birthday': '2000.12.11',
    'password': 'asdkl34jk',
    'gender': 'm'
  }
]

db_details = {
  MOVIES_PATH: [Movie, MovieDao, 'movie'],
  BOOKS_PATH: [Book, BookDao, 'book'],
  SHOWS_PATH: [Show, ShowDao, 'show']
}

def populate_product(
  path: str,
  product_dao: ProductDao
) -> list[dict]:
  products = list()
  data = pd.read_csv(path, keep_default_na=False).T.to_dict()
  for row in list(data.values())[:LIMIT]:
    row['genres'] = row['genres'].split(', ') if len(row['genres']) else []
    products.append(row)
    product_dao.add_new(row)
  return products

def populate_reviews(
  products: list[dict],
  review_type: str,
  product_model: any
):
  for user in users:
    db_user = User.query.filter_by(name=user['name']).first()
    reiewed_products = sample(products, randint(0, 40))
    for product in reiewed_products:
      db_product = product_model.query.join(MediaProduct) \
        .filter_by(title=product['title']).first()
      review_data = {
        'user_id': db_user.id,
        'product_id': db_product.id,
        'rate': randint(0, 5)
      }
      ReviewDao.add_new(review_data, review_type)

def populate_db():
  for user in users: UserDao.add_user(user)
  for path, (
    product_model, product_dao, review_dao
  ) in db_details.items():
    products = populate_product(path, product_dao)
    populate_reviews(products, review_dao, product_model)
