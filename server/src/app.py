from flask import Flask
from flask_cors import CORS
from init_db import init_db
from apps.user.views import user
from apps.product.views import product
from apps.recommend.views import recommend
from apps.authenticate.views import authenticate
from apps.err_handler import register_err_handler
from apps.products_list.views import products_list

def create_app() -> Flask:
  apps = [authenticate, user, product, recommend, products_list]
  app = Flask(__name__)
  app.config.from_object('config.DevelopmentConfig')
  register_err_handler(app)
  CORS(app)
  init_db(app)
  for bp in apps: app.register_blueprint(bp)
  return app

if __name__ == '__main__':
  create_app().run()
