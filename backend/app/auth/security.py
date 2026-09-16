from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

def hash_the_password(password):
    return password_hash.hash(password)

def check_the_password(hash_password, password):
    return password_hash.verify(password, hash_password)