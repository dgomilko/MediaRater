from dataclasses import dataclass
from db.database import db
from sqlalchemy.exc import SQLAlchemyError

class Dao():

  @staticmethod
  def commit() -> bool:
    try:
      db.session.commit()
      return True
    except SQLAlchemyError as e:
      print(e)
      db.session.rollback()
      return False

  @staticmethod
  def get_by_id(model: db.Model, id: str) -> any:
    return model.query.filter_by(id=id).first()
