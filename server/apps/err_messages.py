from enum import Enum

err_response = lambda msg, status: ({ 'message': msg }, status)

class ErrMsg(str, Enum):
  INVALID: str = 'Invalid data'
  AUTH_REQUIRED: str = 'Authorization token required'
  BLACKLIST: str = 'Token blacklisted'
  NO_REVIEWS: str = 'Couldn\'t find any reviews'
  NO_USER: str = 'User not found'
  NO_PRODUCT: str = 'Product not found'
  NO_CONTENT: str = 'Couldn\'t find this content'
  NO_STATS: str = 'Couldn\'t find any data about this product'
  NO_PAGE: str = 'Couldn\'t load this page'
  EMAIL_TAKEN: str = 'This email is alredy taken'
  UNKNOWN_EMAIL: str = 'User with this email does not exist'
  WRONG_PASSWD: str = 'Invalid password'
  LOGOUT_ERROR: str = 'Error while logging out'
  NO_RECS: str = 'Not enough reviews to make recommendations'
  REVIEWED: str = 'You have already reviewed this product'
