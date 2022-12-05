from sqlalchemy.orm import declared_attr
from sqlalchemy.sql import func
from security_utils.id_gen import generate_key
from extensions import db

class IntIdMixin(object):
  id = db.Column(db.Integer, primary_key=True)

class StrIdMixin(object):
  id = db.Column(
    db.String(22),
    primary_key=True,
    autoincrement=False,
    default=generate_key
  )

class ProductMixin(StrIdMixin, object):
  @declared_attr
  def product_id(cls):
    return db.Column(
      db.Integer,
      db.ForeignKey('media_products.id'),
      nullable=True
    )

  @declared_attr
  def product(cls):
    return db.relationship(
      'MediaProduct',
      backref=db.backref(cls.__name__.lower(), uselist=False)
    )

  @declared_attr
  def reviews(cls):
    return db.relationship(
      f'{cls.__name__}Review',
      back_populates='product',
      lazy='dynamic'
    )

class ReviewMixin(IntIdMixin, object):
  text = db.Column(db.Text, nullable=True)
  rate = db.Column(db.Integer, nullable=False)
  created = db.Column(
    db.DateTime(timezone=True),
    default=func.now()
  )

  @declared_attr
  def user_id(cls):
    return db.Column(
    db.String(22),
    db.ForeignKey('users.id')
  )

  @declared_attr
  def user(cls):
    return db.relationship(
      'User',
      back_populates=cls.__tablename__,
      uselist=False
    )
