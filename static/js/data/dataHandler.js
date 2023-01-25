export let dataHandler = {
  getBoards: async function () {
    return await apiGet("/api/boards");
  },
  getBoard: async function (boardId) {
    // the board is retrieved and then the callback function is called with the board
  },
  getStatuses: async function () {
    return await apiGet(`/api/statuses`);
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
  createNewCard: async function (cardTitle, boardId, statusId) {
    // creates new card, saves it and calls the callback function with its data
  },
  deleteCard: async function (cardId) {
    await apiDelete(`/api/cards/${cardId}/delete`);
  },
  updateCardStatus: async function (cardId, statusId) {
    await apiPatch(`/api/cards/${cardId}/status/update`, {
      statusId: statusId,
    });
  },
  changeBoardTitleApi: async function (boardID, title) {
    let data = { Id: boardID, title: title };
    return await apiPut(`/api/board/${boardID}`, data);
  },
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
