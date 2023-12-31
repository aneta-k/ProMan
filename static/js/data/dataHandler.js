export let dataHandler = {
  getBoards: async function () {
    return await apiGet("/api/boards");
  },
  getStatuses: async function (boardId) {
    return await apiGet(`/api/boards/${boardId}/statuses`);
  },
  getCardsByBoardId: async function (boardId, archivedStatus) {
    return await apiGet(`/api/boards/${boardId}/cards/archived=${archivedStatus}`);
  },
  getCard: async function (cardId) {
    return await apiGet(`/api/cards/${cardId}`);
  },
  createNewBoard: async function (boardTitle, privateBoard) {
    return await apiPost(`/api/boards/create`, { title: boardTitle, privateBoard: privateBoard });
  },
  createNewCard: async function (cardTitle, boardId, statusId, cardOrder) {
    let card = { status_id: statusId, title: cardTitle, card_order: cardOrder };
    return await apiPost(`/api/boards/${boardId}/cards/add_new`, card);
  },
  createNewColumn: async function (boardId, columnTitle) {
    return await apiPost(`/api/boards/${boardId}/statuses/create`, {title: columnTitle});
  },
  deleteCard: async function (cardId) {
    await apiDelete(`/api/cards/${cardId}/delete`);
  },
  updateCardStatus: async function (cardId, statusId) {
    await apiPatch(`/api/cards/${cardId}/status/update`, {statusId: statusId});
  },
  updateCardsOrder: async function(cardId, data) {
    await apiPatch(`api/cards/${cardId}/card_order/update`, data);
  },
  updateCardOrderAfterCardDelete: async function (cardData) {
    await apiPatch(`/api/cards/card_order_after_delete/update`, cardData);
  },
  changeBoardTitleApi: async function (boardID, title) {
    let data = { id: boardID, title: title };
    return await apiPatch(`/api/board/${boardID}`, data);
  },
  deleteBoard: async function (boardId) {
    await apiDelete(`/api/boards/${boardId}/delete`);
  },
  deleteColumn: async function (columnId) {
    await apiDelete(`/api/columns/${columnId}/delete`);
  },
  changeCardTitleApi: async function (cardID, title) {
    let data = { id: cardID, title: title };
    return await apiPatch(`/api/card/${cardID}`, data);
  },
  updateCardArchivedStatus: async function (cardId, newStatus, newOrder) {
    let data = {new_status: newStatus, new_order: newOrder};
    await apiPatch(`/api/cards/${cardId}/archived_status/update`, data);
  },
  login: async function (username, password) {
    let data = { username: username, password: password };
    return await apiPost(`/login`, data);
  },
  register: async function (username, password) {
    let data = { username: username, password: password };
    return await apiPost(`/register`, data);
  },
  logout: async function () {
    return await apiPost(`/logout`);
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
    return await response.json();
  }
}

async function apiDelete(url) {
  await fetch(url, {
    method: "DELETE",
  });
}

async function apiPatch(url, payload) {
  await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
