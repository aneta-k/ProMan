export let dataHandler = {
  getBoards: async function () {
    return await apiGet("/api/boards");
  },
  getBoard: async function (boardId) {
    // the board is retrieved and then the callback function is called with the board
  },
  getStatuses: async function (boardId) {
    return await apiGet(`/api/boards/${boardId}/statuses`);
  },
  getStatus: async function (statusId) {
    // the status is retrieved and then the callback function is called with the status
  },
  getCardsByBoardId: async function (boardId) {
    return await apiGet(`/api/boards/${boardId}/cards/`);
  },
  getCard: async function (cardId) {
    // the card is retrieved and then the callback function is called with the card
  },
  createNewBoard: async function (boardTitle) {
    return await apiPost(`/api/boards/create`, { title: boardTitle });
  },
  createNewCard: async function (cardTitle, boardId, statusId, cardOrder) {
    let card = { status_id: statusId, title: cardTitle, card_order: cardOrder };
    return await apiPost(`/api/boards/${boardId}/cards/add_new`, card);
  },
  deleteCard: async function (cardId) {
    await apiDelete(`/api/cards/${cardId}/delete`);
  },
  updateCardStatus: async function (cardId, statusId) {
    await apiPatch(`/api/cards/${cardId}/status/update`, {
      statusId: statusId,
    });
  },
  updateCardsOrder: async function(cardId, newCardOrder, oldCardOrder, boardId, newStatusId, oldStatusId) {
    let data = {
      new_card_order: newCardOrder,
      old_card_order: oldCardOrder,
      new_status: newStatusId,
      old_status: oldStatusId,
      board_id: boardId
    }
    await apiPatch(`api/cards/${cardId}/card_order/update`, data);
  },
  changeBoardTitleApi: async function (boardID, title) {
    let data = { id: boardID, title: title };
    return await apiPatch(`/api/board/${boardID}`, data);
  },
  deleteBoard: async function (boardId) {
    await apiDelete(`/api/boards/${boardId}/delete`);
  },
  changeCardTitleApi: async function (cardID, title) {
    let data = { id: cardID, title: title };
    return await apiPatch(`/api/card/${cardID}`, data);
  },
  changeColumnTitleApi: async function (columnID, title) {
    let data = { id: columnID, title: title };
    return await apiPatch(`/api/column/${columnID}`, data);
  }
};

async function apiGet(url) {
  let response = await fetch(url, {
    method: "GET",
  });
  if (response.ok) {
    return await response.json();
  }
}

async function apiPost(url, payload) {
  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    // return console.log('ok')
    return await response.json();
  }
}

async function apiDelete(url) {
  await fetch(url, {
    method: "DELETE",
  });
}

async function apiPut(url) {}

async function apiPatch(url, payload) {
  await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
