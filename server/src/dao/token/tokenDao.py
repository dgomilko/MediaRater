from dao.dao import Dao
from extensions import db
from db.models import BlacklistedToken

class TokenDao(Dao):

  @staticmethod
  def blacklist(token: str) -> bool:
    db.session.add(BlacklistedToken(token=token))
    return super(TokenDao, TokenDao).commit()

  @staticmethod
  def check(token: str) -> bool:
    res = BlacklistedToken.query.filter_by(token=token).first()
    return res is not None
