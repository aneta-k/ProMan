import bcrypt

ENCODING = 'utf-8'


def hash_password(plain_text_password):
    """
    Hashes a plain text password using bcrypt
    :param plain_text_password: Password in plain text format
    :returns: Hashed password as a string
    """
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode(ENCODING), bcrypt.gensalt())
    return hashed_bytes.decode(ENCODING)


def verify_password(plain_text_password, hashed_password):
    """
    Verifies if the given plain text password matches the hashed password
    :param plain_text_password: Password in plain text format
    :param hashed_password: Hashed password
    :returns: True if passwords match, False otherwise
    """
    return bcrypt.checkpw(plain_text_password.encode(ENCODING), hashed_password.encode(ENCODING))
