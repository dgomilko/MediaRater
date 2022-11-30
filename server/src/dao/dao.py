from sqlalchemy.exc import SQLAlchemyError
from extensions import db

class Dao():
  @staticmethod
  def commit() -> bool:
    try:
      db.session.commit()
      return True
    except SQLAlchemyError:
      db.session.rollback()
      return False

  @staticmethod
  def get_by_id(model: db.Model, id: str) -> any:
    return model.query.filter_by(id=id).first()
