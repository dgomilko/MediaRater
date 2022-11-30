from app import create_app
from celery import Celery, Task
from config import Config

app = create_app()
app.app_context().push()

def make_celery(app):
  celery = Celery(
    app.import_name,
    backend=Config.CELERY_RESULT_BACKEND,
    broker=Config.CELERY_BROKER_URL
  )

  class ContextTask(Task):
    abstract = True
    def __call__(self, *args, **kwargs):
      with app.app_context():
        return Task.__call__(self, *args, **kwargs)

  celery.Task = ContextTask
  return celery

celery = make_celery(app)
