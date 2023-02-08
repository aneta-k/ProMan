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


def change_board_title(board_id, title):
    data_manager.execute(
        """
        UPDATE boards
        SET title = %(title)s
        WHERE id = %(board_id)s
        ;
        """
        , {"board_id": board_id, "title": title})


def create_private_board(title, user_id):
    return data_manager.execute_select(
        """
        INSERT INTO boards (title, user_id)
        VALUES (%(title)s, %(user_id)s)
        RETURNING *
        ;
        """
        , {"title": title, "user_id": user_id})
