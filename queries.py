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
        ORDER BY card_order;
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


def get_statuses(board_id):
    return data_manager.execute_select(
        """
        SELECT * FROM statuses WHERE board_id = %(board_id)s
        ;
        """
        , {'board_id': board_id}
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


def update_card_order(card_id, new_card_order):
    data_manager.execute_query(
        '''
        UPDATE cards
        SET card_order = %(new_order)s
        WHERE id = %(card_id)s;
        ''',
        {'card_id': card_id, 'new_order': new_card_order}
    )


def update_cards_order(change, card_order, status_id, board_id, card_id):
    data_manager.execute_query(
        '''
        UPDATE cards
        SET card_order = card_order + %(change)s
        WHERE card_order >= %(card_order)s 
        AND status_id = %(status_id)s AND board_id = %(board_id)s AND id != %(card_id)s;
        ''',
        {'change': change, 'card_order': card_order, 'status_id': status_id, 'board_id': board_id, 'card_id': card_id}
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

def change_card_title(card_id, title):
    data_manager.execute(
        """
        UPDATE cards
        SET title = %(title)s
        WHERE id = %(card_id)s
        ;
        """
        , {"card_id": card_id, "title": title})