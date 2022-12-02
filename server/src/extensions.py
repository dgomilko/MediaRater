from celery import Celery
from config import Config
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
celery = Celery(
  backend=Config.CELERY_RESULT_BACKEND,
  broker=Config.CELERY_BROKER_URL
)
