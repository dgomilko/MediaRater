import bcrypt

def check_passwd(sent_passwd: str, compared_passwd: str) -> bool:
  passwd_encoded = [
    p.encode('utf-8') for p in [sent_passwd, compared_passwd]
  ]
  return bcrypt.checkpw(*passwd_encoded)

def encrypt_passwd(passwd: str) -> str:
  pwhash = bcrypt.hashpw(passwd.encode('utf8'), bcrypt.gensalt())
  return pwhash.decode('utf8')

