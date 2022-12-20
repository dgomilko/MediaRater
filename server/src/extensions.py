from celery import Celery
from config import Config
from flask_caching import Cache
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
celery = Celery(
  backend=Config.CELERY_RESULT_BACKEND,
  broker=Config.CELERY_BROKER_URL
)
cache = Cache(config={
  'CACHE_TYPE': 'MemcachedCache',
  'CACHE_MEMCACHED_SERVERS': [Config.CACHE_MEMCACHED_SERVERS],
  'CACHE_DEFAULT_TIMEOUT': Config.CACHE_EXPIRATION,
})
