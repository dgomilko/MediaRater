import argparse
from extensions import db
from db_populate import populate_db
from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database

def init_db(app, populate=False):
  db.app = app
  db.init_app(app)
  engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
  if not database_exists(engine.url):
    create_database(engine.url)
  print(db.create_all())
  if populate: populate_db()

def conf_db_populate():
  parser = argparse.ArgumentParser()
  parser.add_argument(
    '-p',
    '--populate',
    help='Populate db',
    default=False,
    action=argparse.BooleanOptionalAction
  )
  args = parser.parse_args()
  return args.populate
