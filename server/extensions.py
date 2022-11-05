from celery import Celery
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

celery = Celery()
celery.config_from_object('config.DevelopmentConfig', namespace='CELERY')
