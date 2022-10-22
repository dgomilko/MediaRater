from dataclasses import dataclass
import string

@dataclass
class MediaProductType:
  title: string
  release: string
  img_path: string
  genres: list[str]

@dataclass
class MovieType(MediaProductType):
  runtime: string

@dataclass
class UserType:
  name: string
  email: string

@dataclass
class ReviewType:
  rate: int
  user_id: string = ''
  product_id: string = ''
  text: string = ''
