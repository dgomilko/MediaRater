from flask import Flask
from extensions import db
from apps.authenticate.views import authenticate
from apps.user.views import user
from apps.product.views import product
from apps.recommend.views import recommend

def init_db(app):
  db.app = app
  db.init_app(app)
  db.create_all()

def create_app() -> Flask:
  apps = [authenticate, user, product, recommend]
  app = Flask(__name__)
  app.config.from_object('config.DevelopmentConfig')
  init_db(app)
  # populate_db()
  for bp in apps: app.register_blueprint(bp)
  return app

if __name__ == '__main__':
  create_app().run()
