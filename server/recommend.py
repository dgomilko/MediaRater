import pandas as pd
from surprise import SVD, Dataset, Reader

from scipy.sparse import coo_matrix
import lightfm as lf
import numpy as np

def create_dataframe(data: list[tuple]) -> pd.DataFrame:
  columns = ['product_id', 'user_id', 'rate']
  return pd.DataFrame.from_records(data, columns=columns)

# def get_recommendations(data: pd.DataFrame, user_id: str, top_n: int = 10):
#   svd = SVD()
#   reader = Reader(rating_scale=(0, 5))
#   dataset = Dataset.load_from_df(data, reader)
#   trainset = dataset.build_full_trainset()
#   testset = trainset.build_testset()
#   svd.fit(trainset)
#   predictions = svd.test(testset)
#   test = pd.DataFrame(predictions)
#   result = test.pivot_table(
#     index='uid', 
#     columns='iid',
#     values='est'
#   ).fillna(0)
#   recommended_items = pd.DataFrame(result.loc[user_id])
#   recommended_items.columns = ['predicted_rating']
#   recommended_items = recommended_items.sort_values('predicted_rating', ascending=False)    
#   recommended_items = recommended_items.head(top_n)
#   return recommended_items.index.tolist()

def get_recommendations(data: pd.DataFrame, user_id: str, top_n: int = 10) -> list[str]:
  users_n = data['user_id'].nunique()
  products_n = data['product_id'].nunique()
  lookup_uid, idx_uid = np.unique(data['user_id'], return_inverse=True)
  lookup_pid, idx_pid = np.unique(data['product_id'], return_inverse=True)
  sparse_matrix = coo_matrix(
    (data['rate'], (idx_uid, idx_pid)), shape=(users_n, products_n)
  )
  model = lf.LightFM(loss='warp')
  model.fit(sparse_matrix, epochs=30, num_threads=8)
  mapped_uid = np.where(lookup_uid == user_id)[0]
  print(mapped_uid, np.unique(idx_pid))
  predicted = model.predict(user_ids=int(mapped_uid[0]), item_ids=np.unique(idx_pid))
  return lookup_pid[np.argsort(-predicted)][:top_n]