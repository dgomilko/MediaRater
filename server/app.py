from flask import Flask, jsonify, request
from db.models import db
from config import DB_URL
from db_populate import populate_with_movies
from recommend import *
from dao.review_daos import MovieReviewDao
from dao.userDao import UserDao
from dao.product_daos import MovieDao

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

@app.route('/')
def index():
  return jsonify({"message":"Welcome to my site"})

db.app = app
db.init_app(app)
db.create_all()
populate_with_movies()
data = MovieReviewDao.get_ratings()
# print(UserDao.get_by_id(data[0][1]))
# print(MovieDao.get_by_id(data[0][0]))
# df = create_dataframe(data)
# print(get_recommendations(df, data[0][1]))
app.run(
  use_reloader=False,
  debug=True
)
