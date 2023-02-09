import data_manager


def delete_column(column_id):
    data_manager.execute_query(
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


def change_column_title(column_id, title):
    data_manager.execute_query(
        """
        UPDATE statuses
        SET title = %(title)s
        WHERE id = %(column_id)s
        ;
        """
        , {"column_id": column_id, "title": title})
