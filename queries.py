import data_manager


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


def get_boards():
    """
    Gather all boards
    :return:
    """
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ORDER BY id ASC
        ;
        """
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


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def add_new_card(card, board_id):
    return data_manager.execute_select(
        '''
        INSERT INTO cards (board_id, status_id, title, card_order)
        VALUES (%(board_id)s, %(status_id)s, %(title)s, %(card_order)s)
        RETURNING id;
        ''',
        {'board_id': board_id, 'status_id': card['status_id'], 'title': card['title'], 'card_order': card['card_order']},
        False)


def get_card_by_id(card_id):
    return data_manager.execute_select(
        '''
        SELECT * FROM cards
        WHERE id = %(card_id)s
        ''',
        {'card_id': card_id}, False
    )


def get_statuses():
    return data_manager.execute_select(
        """
        SELECT * FROM statuses
        ;
        """
    )


def delete_card(card_id):
    data_manager.execute(
        """
        DELETE FROM cards
        WHERE id = %(card_id)s
        ;
        """
        , {"card_id": card_id})


def update_card_status(card_id, status_id):
    data_manager.execute(
        """
        UPDATE cards
        SET status_id = %(status_id)s
        WHERE id = %(card_id)s
        ;
        """
        , {"card_id": card_id, "status_id": status_id})

def change_board_title(board_id, title):
    data_manager.execute(
        """
        UPDATE boards
        SET title = %(title)s
        WHERE id = %(board_id)s
        ;
        """
        , {"board_id": board_id, "title": title})
