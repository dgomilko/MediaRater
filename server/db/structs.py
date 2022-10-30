from dataclasses import dataclass, field
from datetime import datetime
import string

@dataclass
class BaseDC:
  def as_dict(self):
    data = self.__dict__
    return {key: value for key, value in data.items() if value is not None}

@dataclass
class MediaProductType(BaseDC):
  title: string
  release: string
  img_path: string
  synopsis: string
  genres: list[str]

@dataclass
class MovieType(MediaProductType):
  runtime: string
  director: string

@dataclass
class BookType(MediaProductType):
  pages: string
  author: string

@dataclass
class ShowType(MediaProductType):
  seasons: int
  episodes: int

@dataclass
class UserType(BaseDC):
  name: string
  email: string
  birthday: string
  gender: string
  country: string
  password: string = None
  id: string = None

@dataclass
class ReviewType(BaseDC):
  rate: int
  user_id: string = None
  product_id: string = None
  text: string = None
