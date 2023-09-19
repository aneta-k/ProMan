import data_manager


def get_public_boards():
    """
    Retrieve all public boards from the database.
    :returns: List of dictionaries, each representing a public board.
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
    Retrieve all public and private boards of a specific user
    :param user_id: ID of the user.
    :returns: List of dictionaries, each representing a board.
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
    data_manager.execute_query(
        """
        DELETE FROM boards
        WHERE id = %(board_id)s
        ;
        """
        , {"board_id": board_id})


def change_board_title(board_id, title):
    data_manager.execute_query(
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
