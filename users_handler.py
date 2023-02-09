import data_manager


def get_user_from_username(username):
    return data_manager.execute_select('''
        SELECT *
        FROM users
        WHERE username = %(username)s''', {'username': username}, False)


def register_new_user(username, password):
    return data_manager.execute_query("""
        INSERT INTO users (username, password)
        VALUES (%(username)s, %(password)s)
        """, {'username': username, 'password': password})
