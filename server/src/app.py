from flask import Flask
from flask_cors import CORS
from extensions import cache
from apps.user.routes import user
from apps.product.routes import product
from apps.recommend.routes import recommend
from init_db import init_db, conf_db_populate
from apps.authenticate.routes import authenticate
from apps.err_handler import register_err_handler
from apps.products_list.routes import products_list

def create_app(populate=False) -> Flask:
  apps = [authenticate, user, product, recommend, products_list]
  app = Flask(__name__)
  app.config.from_object('config.DevelopmentConfig')
  register_err_handler(app)
  CORS(app)
  cache.init_app(app)
  init_db(app, populate)
  for bp in apps: app.register_blueprint(bp)
  return app

if __name__ == '__main__':
  populate = conf_db_populate()
  app = create_app(populate)
  app.run()
