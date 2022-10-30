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

#DB_URL = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=POSTGRES_USER,pw=POSTGRES_PW,url=POSTGRES_URL,db=POSTGRES_DB)

class DevelopmentConfig():
	ENV = 'development'
	DEVELOPMENT = True
	DEBUG = False
	USE_RELOADER = False
	SQLALCHEMY_DATABASE_URI = DB_URL
	SQLALCHEMY_TRACK_MODIFICATIONS = False
