import data_manager


def get_card_status(status_id):
    """
    Retrieve the status details for a given status ID
    :param status_id: ID of the status.
    :returns: Dictionary representing the status details.
    """
    query = """
            SELECT * FROM statuses s
            WHERE s.id = %(status_id)s
        """
    return data_manager.execute_select(query, {"status_id": status_id})


def get_cards_for_board(board_id, archived_status):
    """
        Retrieve all cards for a specific board based on their archived status
        :param board_id: ID of the board
        :param archived_status: Boolean representing the archived status of the cards.
        :returns: List of dictionaries, each representing a card.
        """
    query = """
            SELECT * FROM cards
            WHERE cards.board_id = %(board_id)s AND cards.archived = %(archived_status)s
            ORDER BY card_order
        """
    return data_manager.execute_select(query, {"board_id": board_id, "archived_status": archived_status})


def add_new_card(card, board_id):
    return data_manager.execute_select(
        '''
        INSERT INTO cards (board_id, status_id, title, card_order, archived)
        VALUES (%(board_id)s, %(status_id)s, %(title)s, %(card_order)s, FALSE)
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


def delete_card(card_id):
    data_manager.execute_query(
        """
        DELETE FROM cards
        WHERE id = %(card_id)s
        ;
        """
        , {"card_id": card_id})


def update_card_status(card_id, status_id):
    data_manager.execute_query(
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
        AND status_id = %(status_id)s AND board_id = %(board_id)s AND id != %(card_id)s AND archived = false;
        ''',
        {'change': change, 'card_order': card_order, 'status_id': status_id, 'board_id': board_id, 'card_id': card_id}
    )


def update_card_archived_status(card_id, new_archived_status):
    data_manager.execute_query(
        '''
        UPDATE cards
        SET archived = %(new_archived_status)s
        WHERE id = %(card_id)s
        ''',
        {'new_archived_status': new_archived_status, 'card_id': card_id}
    )


def change_card_title(card_id, title):
    data_manager.execute_query(
        """
        UPDATE cards
        SET title = %(title)s
        WHERE id = %(card_id)s
        ;
        """
        , {"card_id": card_id, "title": title})
    