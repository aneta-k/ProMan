import mimetypes

from flask import Flask, render_template, url_for, request, jsonify, session, make_response, send_from_directory
from dotenv import load_dotenv

import password_handler
import users_handler
import cards_handler
import boards_handler
import columns_handler
from util import json_response

# Constants
HTTP_OK = 200
HTTP_CREATED = 201
HTTP_UNAUTHORIZED = 401
HTTP_CONFLICT = 409

# App configurations
app = Flask(__name__)
app.secret_key = 'codecool'
mimetypes.add_type('application/javascript', '.js')
load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    response = make_response(render_template('index.html'))
    response.set_cookie('logged_in', str('username' in session))
    return response


# User handling
@app.route('/login', methods=['POST'])
@json_response
def login():
    user_data = users_handler.get_user_from_username(request.json['username'])
    input_password = request.json['password']
    if user_data:
        hashed_password = user_data['password']
        is_matching = password_handler.verify_password(input_password, hashed_password)
        if is_matching:
            session['user_id'] = user_data['id']
            session['username'] = user_data['username']
            return HTTP_OK
    return HTTP_UNAUTHORIZED


@app.route("/register", methods=['POST'])
@json_response
def register_user():
    username_input = request.json['username']
    hashed_password = password_handler.hash_password(request.json['password'])
    if users_handler.get_user_from_username(username_input):
        return HTTP_CONFLICT
    users_handler.register_new_user(username_input, hashed_password)
    user_data = users_handler.get_user_from_username(username_input)
    session['username'] = username_input
    session['user_id'] = user_data['id']
    return HTTP_OK


@app.route('/logout', methods=['POST'])
@json_response
def logout():
    session.pop('username', None)
    session.pop('user_id', None)
    return HTTP_OK


# Boards handling
@app.route("/api/boards")
@json_response
def get_boards():
    if "username" in session:
        return boards_handler.get_public_and_private_boards(session['user_id'])
    return boards_handler.get_public_boards()


@app.route("/api/boards/create", methods=['POST'])
@json_response
def create_board():
    title = request.json['title']
    private_board = request.json['privateBoard']
    if private_board == 'on':
        user_id = session['user_id']
        return boards_handler.create_private_board(title, user_id)
    return boards_handler.create_board(title)


@app.route("/api/boards/<int:board_id>/delete", methods=['DELETE'])
@json_response
def delete_board(board_id):
    boards_handler.delete_board(board_id)
    return HTTP_OK


@app.route("/api/board/<int:board_id>", methods=["PATCH"])
@json_response
def change_board_title(board_id):
    title = request.json['title']
    return boards_handler.change_board_title(board_id, title)


# Columns handling
@app.route("/api/columns/<int:column_id>/delete", methods=['DELETE'])
@json_response
def delete_column(column_id):
    columns_handler.delete_column(column_id)
    return HTTP_OK


@app.route('/api/boards/<int:board_id>/statuses/create', methods=['POST'])
@json_response
def add_new_column(board_id: int):
    title = request.get_json()['title']
    return columns_handler.add_new_column(board_id, title)


@app.route("/api/boards/<int:board_id>/statuses")
@json_response
def get_statuses(board_id):
    return columns_handler.get_statuses(board_id)


@app.route("/api/column/<int:column_id>", methods=["PATCH"])
@json_response
def change_column_title(column_id):
    title = request.json['title']
    return columns_handler.change_column_title(column_id, title)


# Cards handling
@app.route("/api/boards/<int:board_id>/cards/archived=<archived_status>")
@json_response
def get_cards_for_board(board_id: int, archived_status: bool):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    :param archived_status: archived or not cards
    """
    return cards_handler.get_cards_for_board(board_id, archived_status)


@app.route('/api/cards/<int:card_id>')
@json_response
def get_card(card_id):
    return cards_handler.get_card_by_id(card_id)


@app.route('/api/boards/<int:board_id>/cards/add_new', methods=['POST'])
def add_new_card(board_id: int):
    card = request.get_json()
    card_id = cards_handler.add_new_card(card, board_id)
    return cards_handler.get_card_by_id(card_id['id'])


@app.route("/api/cards/<int:card_id>/delete", methods=['DELETE'])
@json_response
def delete_card(card_id):
    cards_handler.delete_card(card_id)
    return HTTP_OK


@app.route("/api/cards/<int:card_id>/status/update", methods=['PATCH'])
@json_response
def update_card_status(card_id):
    status = request.json['statusId']
    cards_handler.update_card_status(card_id, status)
    return HTTP_OK


@app.route('/api/cards/<int:card_id>/card_order/update', methods=['PATCH'])
@json_response
def update_cards_order(card_id):
    data = request.get_json()
    cards_handler.update_card_order(card_id, data['new_card_order'])
    cards_handler.update_cards_order(-1, data['old_card_order'], data['old_status'], data['board_id'], card_id)
    cards_handler.update_cards_order(1, data['new_card_order'], data['new_status'], data['board_id'], card_id)
    return HTTP_OK


@app.route('/api/cards/card_order_after_delete/update', methods=['PATCH'])
@json_response
def update_cards_order_after_delete():
    data = request.get_json()
    cards_handler.update_cards_order(-1, data['card_order'], data['status_id'], data['board_id'], data['card_id'])
    return HTTP_OK


@app.route('/api/cards/<int:card_id>/archived_status/update', methods=['PATCH'])
@json_response
def update_card_archived_status(card_id):
    new_archived_status = request.get_json()['new_status']
    new_card_order = request.get_json()['new_order']
    cards_handler.update_card_archived_status(card_id, new_archived_status)
    cards_handler.update_card_order(card_id, new_card_order)
    return HTTP_OK


@app.route("/api/card/<int:card_id>", methods=["PATCH"])
@json_response
def change_card_title(card_id):
    title = request.json['title']
    return cards_handler.change_card_title(card_id, title)


# Offline route handling
@app.route('/service-worker.js', methods=['GET'])
def service_worker_offline():
    response = make_response(send_from_directory('static', 'service-worker.js'))
    response.headers['Content-Type'] = 'application/javascript'
    return response


def main():
    app.run(debug=True)
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
