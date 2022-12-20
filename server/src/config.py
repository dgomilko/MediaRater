import os
from dotenv import load_dotenv

load_dotenv()

default_params = {
	'DB_HOST': 'localhost',
	'DB_PORT': 5432,
	'DB_USER': 'postgres',
	'DB_PASSWORD': '',
	'DB_NAME': 'postgres',
	'TOKEN_EXP_MINS': 45,
	'REDIS_URL': 'redis://:localhost:6379/0',
	'HOST': 'localhost',
	'PORT': 5000,
	'CACHE_MEMCACHED_SERVERS': 'localhost:11211',
	'CACHE_EXPIRATION_MIN': 30
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
	SECRET_KEY = os.environ['SECRET_KEY']
	CELERY_BROKER_URL = load_env('REDIS_URL')
	CELERY_RESULT_BACKEND = load_env('REDIS_URL')
	TOKEN_EXP_MINS = load_env('TOKEN_EXP_MINS')
	SERVER_NAME = f'{load_env("HOST")}:{load_env("PORT")}'
	CELERY_RESULT_BACKEND = load_env('REDIS_URL')
	CACHE_EXPIRATION = load_env('CACHE_EXPIRATION_MIN') * 60
	CACHE_MEMCACHED_SERVERS = load_env('CACHE_MEMCACHED_SERVERS')

class DevelopmentConfig(Config):
	ENV = 'development'
	DEVELOPMENT = True
	DEBUG = False
	USE_RELOADER = False
