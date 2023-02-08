import data_manager


def get_public_boards():
    """
    Gather all boards
    :return:
    """
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        WHERE user_id IS NULL
        ORDER BY id ASC
        ;
        """
    )


def get_public_and_private_boards(user_id):
    """
    Gather all boards
    :return:
    """
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        WHERE user_id IS NULL
        UNION 
        SELECT * FROM boards
        WHERE user_id = %(user_id)s
        ORDER BY id ASC
        ;
        """, {"user_id": user_id}
    )


def create_board(title):
    return data_manager.execute_select(
        """
        INSERT INTO boards (title)
        VALUES (%(title)s)
        RETURNING *
        ;
        """
        , {"title": title})


def delete_board(board_id):
    data_manager.execute(
        """
        DELETE FROM boards
        WHERE id = %(board_id)s
        ;
        """
        , {"board_id": board_id})


def delete_column(column_id):
    data_manager.execute(
        """
        DELETE FROM statuses
        WHERE id = %(column_id)s
        ;
        """
        , {"column_id": column_id})


def add_new_column(board_id, title):
    return data_manager.execute_select(
        '''
        INSERT INTO statuses (board_id, title)
        VALUES (%(board_id)s, %(title)s)
        RETURNING *;
        ''',
        {'board_id': board_id, 'title': title}, False
    )


def get_statuses(board_id):
    return data_manager.execute_select(
        """
        SELECT * FROM statuses WHERE board_id = %(board_id)s
        ORDER BY id
        ;
        """
        , {'board_id': board_id}
    )


def change_board_title(board_id, title):
    data_manager.execute(
        """
        UPDATE boards
        SET title = %(title)s
        WHERE id = %(board_id)s
        ;
        """
        , {"board_id": board_id, "title": title})


def get_user_from_username(username):
    return data_manager.execute_select('''
        SELECT *
        FROM users
        WHERE username = %(username)s''', {'username': username}, False)


def register_new_user(username, password):
    return data_manager.execute("""
        INSERT INTO users (username, password)
        VALUES (%(username)s, %(password)s)
        """, {'username': username, 'password': password})



def change_column_title(column_id, title):
    data_manager.execute(
        """
        UPDATE statuses
        SET title = %(title)s
        WHERE id = %(column_id)s
        ;
        """
        , {"column_id": column_id, "title": title})


def create_private_board(title, user_id):
    return data_manager.execute_select(
        """
        INSERT INTO boards (title, user_id)
        VALUES (%(title)s, %(user_id)s)
        RETURNING *
        ;
        """
        , {"title": title, "user_id": user_id})