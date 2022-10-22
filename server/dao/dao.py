from dataclasses import dataclass
from db.database import db
from sqlalchemy.exc import SQLAlchemyError

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
  def get_by_id(model: db.Model, id: str):
    return model.query.filter_by(id=id).first()
