from flask import Flask, render_template, url_for, request, jsonify
from dotenv import load_dotenv
from util import json_response
import mimetypes
import queries

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()

@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queries.get_boards()


@app.route("/api/boards/create", methods=['POST'])
@json_response
def create_board():
    title = request.json['title']
    return queries.create_board(title)


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


@app.route('/api/boards/<int:board_id>/cards/add_new', methods=['POST'])
def add_new_card(board_id: int):
    card = request.get_json()
    card_id = queries.add_new_card(card, board_id)
    return queries.get_card_by_id(card_id['id'])


@app.route("/api/statuses")
@json_response
def get_statuses():
    return queries.get_statuses()


@app.route("/api/cards/<int:card_id>/delete", methods=['DELETE'])
def delete_card(card_id):
    queries.delete_card(card_id)
    return 'ok'


@app.route("/api/cards/<int:card_id>/status/update", methods=['PATCH'])
def update_card_status(card_id):
    status = request.json['statusId']
    queries.update_card_status(card_id, status)
    return 'ok'


@app.route('/api/cards/<int:card_id>/card_order/update', methods=['PATCH'])
def update_cards_order(card_id):
    data = request.get_json()
    queries.update_card_order(card_id, data['new_card_order'])
    queries.update_cards_order(-1, data['old_card_order'], data['old_status'], data['board_id'], card_id)
    queries.update_cards_order(1, data['new_card_order'], data['new_status'], data['board_id'], card_id)
    return 'ok'


@app.route("/api/board/<int:board_id>", methods=["PATCH"])
@json_response
def change_board_title(board_id):
    title = request.json['title']
    return queries.change_board_title(board_id, title)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
