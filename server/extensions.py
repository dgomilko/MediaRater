from celery import Celery
from flask_sqlalchemy import SQLAlchemy
from config import Config

db = SQLAlchemy()
celery = Celery(
  backend=Config.CELERY_RESULT_BACKEND,
  broker=Config.CELERY_BROKER_URL
)
