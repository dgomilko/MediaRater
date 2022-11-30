import jwt
from flask import current_app
from datetime import datetime, timedelta

def encode_token(uid: str) -> str:
  mins = int(current_app.config.get('TOKEN_EXP_MINS'))
  expiration = datetime.utcnow() + timedelta(days=0, minutes=mins)
  payload = {
    'exp': expiration,
    'iat': datetime.utcnow(),
    'sub': uid
  }
  return jwt.encode(
    payload, 
    current_app.config.get('SECRET_KEY'),
    algorithm='HS256'
  )

def decode_token(token: str) -> tuple[bool, str]:
  try:
    payload = jwt.decode(
      token,
      current_app.config.get('SECRET_KEY'),
      algorithms=['HS256']
    )
    return (True, payload['sub'])
  except jwt.ExpiredSignatureError:
    return (False, 'Signature expired')
  except jwt.InvalidTokenError:
    return (False, 'Invalid token')
  