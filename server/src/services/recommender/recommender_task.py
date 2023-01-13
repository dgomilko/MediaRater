import os
import numpy as np
from dao.review.ReviewDao import ReviewDao
from services.recommender.model import model
from scipy.sparse import coo_matrix
from extensions import celery, cache
from dao.product.product_daos import *
from dao.product.ProductDao import ProductDao
from dao.user.userDao import UserDao

@celery.task()
def get_recommendations(
  dao_type: str,
  user_id: str,
  top_n: int = 20
) -> list[dict]:
  (
    (lookup_uid, lookup_pid),
    (uids, pids),
    product_dao
  ) = get_params(dao_type)
  key = f'matrix_{dao_type}'
  matrix = cache.get(key)
  if matrix is None:
    reviews = ReviewDao.get_ratings(dao_type)
    matrix = train_model(
      (lookup_uid, lookup_pid),
      (len(uids), len(pids)),
      np.array(reviews),
      key
    )
  mapped_uid = np.where(lookup_uid == user_id)[0][0]
  unrated = np.where(matrix[mapped_uid] == 0)[0]
  predicted = model.predict(user_ids=int(mapped_uid), item_ids=unrated)
  indices = unrated[np.argsort(-predicted)][:top_n]
  ids = lookup_pid[indices]
  return ids_to_info(ids, product_dao)

@celery.task()
def update_model(dao_type: str) -> list[dict]:
  (lookups, (uids, pids), _) = get_params(dao_type)
  reviews = ReviewDao.get_ratings(dao_type)
  key = f'matrix_{dao_type}'
  train_model(
    lookups,
    (len(uids), len(pids)),
    np.array(reviews),
    key
  )

def create_matrix(
  lookups: tuple[np.ndarray],
  dims: tuple[int],
  rates: np.ndarray
) -> np.ndarray:
  positive_threshhold = 3
  map_ids = lambda lookup, arr: [np.where(lookup == x)[0][0] for x in arr]
  int_rates = np.vstack(np.array((
    map_ids(lookups[0], rates[:,1]),
    map_ids(lookups[1], rates[:,0]),
    [1 if int(x) > positive_threshhold else -1 for x in rates[:,2]])
  ).T)
  matrix = np.zeros(dims)
  for x, y, rate in int_rates: matrix[x][y] = rate
  return matrix

def train_model(
  lookups: tuple[np.ndarray],
  dims: tuple[int],
  rates: np.ndarray,
  key: str,
):
  matrix = create_matrix(lookups, dims, rates)
  cache.set(key, matrix)
  sparse_mat = coo_matrix(matrix)
  threads = len(os.sched_getaffinity(0))
  model.fit(sparse_mat, epochs=30, num_threads=threads)
  return matrix

def ids_to_info(ids: list[str], dao: ProductDao) -> list[dict]:
  full_info = [dao.get_by_id(id) for id in ids]
  keys_to_preserve = ['id', 'title', 'release', 'img_path', 'rating']
  remove_except = lambda d: {
    k: v for k, v in d.items() if k in keys_to_preserve
  }
  return [remove_except(i) for i in full_info]

def get_params(dao_type):
  types = {
    'movie': MovieDao,
    'show': ShowDao,
    'book': BookDao
  }
  product_dao = types[dao_type]
  pids = product_dao.get_ids()
  uids = UserDao.get_ids()
  lookup_uid, _ = np.unique(uids, return_inverse=True)
  lookup_pid, _ = np.unique(pids, return_inverse=True)
  return ((lookup_uid, lookup_pid), (uids, pids), product_dao)
