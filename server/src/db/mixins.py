from sqlalchemy.orm import declared_attr
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
      backref=cls.__name__.lower(),
    )

  @declared_attr
  def reviews(cls):
    return db.relationship(
    'Review',
      secondary='media_products',
      primaryjoin=f'{cls.__name__}.product_id == MediaProduct.id',
      secondaryjoin='Review.product_id == MediaProduct.id',
      viewonly=True,
      lazy='dynamic'
    )
