from uuid import uuid4
from base64 import b64encode
from re import sub

def generate_key() -> str:
  rv = b64encode(uuid4().bytes).decode('utf-8')
  repl = lambda m: {'+': '-', '/': '_', '=': ''}[m.group(0)]
  pattern = r'[\=\+\/]'
  return sub(pattern, repl, rv)

# import pandas as pd

# print(pd.read_csv('./media_data/shows.csv').T.to_dict())
