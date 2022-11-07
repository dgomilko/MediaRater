import os
from dotenv import load_dotenv

# Sets the base directory path
# basedir = os.path.abspath(os.path.dirname(__file__))

# loads the environment variable file
load_dotenv()

default_params = {
	'DB_HOST': 'localhost',
	'DB_PORT': 5432,
	'DB_USER': 'postgres',
	'DB_PASSWORD': '',
	'DB_NAME': 'postgres'
}

def load_env(name):
  try: return os.environ[name]
  except KeyError: return default_params[name]

DB_URL = (f'postgresql+psycopg2://'
	f'{load_env("DB_USER")}:{load_env("DB_PASSWORD")}@'
	f'{load_env("DB_HOST")}:{load_env("DB_PORT")}/'
	f'{load_env("DB_NAME")}')

class Config():
	SQLALCHEMY_DATABASE_URI = DB_URL
	SQLALCHEMY_TRACK_MODIFICATIONS = False
	CELERY_BROKER_URL = 'redis://:redis-passwd0123@localhost:6379/0'
	CELERY_RESULT_BACKEND = 'redis://:redis-passwd0123@localhost:6379/0'

class DevelopmentConfig(Config):
	ENV = 'development'
	DEVELOPMENT = True
	DEBUG = False
	USE_RELOADER = False
