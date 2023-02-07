import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { dragHandler } from "../dragHandler.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId, false);
        for (let card of cards) {
            initNewCardEvents(card, boardId);
        }
    },
    addCardHandler: async function (clickEvent) {
        const boardId = clickEvent.target.dataset.boardId;
        const title = clickEvent.target[0].value;
        const status = clickEvent.target[1].value;
        const currentColumn = document.querySelector(`.board-columns[data-board-id="${boardId}"] .board-column[data-column-id="${status}"] .board-column-content`);
        const cardOrder = currentColumn.childElementCount + 1;
        let newCard = await dataHandler.createNewCard(title, boardId, status, cardOrder);
        domManager.deleteChildren(`#newFormField`);
        initNewCardEvents(newCard, boardId);
    },
    loadArchivedCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId, true);
        for (let card of cards) {
            initArchivedCardEvents(card, boardId);
        }
    },
};

async function archiveButtonHandler(clickEvent) {
    const cardId = clickEvent.target.dataset.cardId;
    const boardId = clickEvent.target.parentElement.dataset.boardId;
    updateCardOrderAfterCardDelete(clickEvent);
    dataHandler.updateCardArchivedStatus(cardId, true, 0);
    domManager.deleteElement(`.card[data-card-id="${cardId}"]`);
    if (domManager.hasChildren(`.board-archived-container[data-board-id="${boardId}"]`)){
        let newCard = await dataHandler.getCard(cardId);
        initArchivedCardEvents(newCard, boardId);
    }
}

async function unarchiveButtonHandler(clickEvent) {
    const cardId = clickEvent.target.dataset.cardId;
    domManager.deleteElement(`.card[data-card-id="${cardId}"]`);
    let newCard = await dataHandler.getCard(cardId);
    const currentColumn = document.querySelector(`.board-columns[data-board-id="${newCard.board_id}"] .board-column[data-column-id="${newCard.status_id}"] .board-column-content`);
    const cardOrder = currentColumn.childElementCount + 1;
    newCard.card_order = cardOrder;
    dataHandler.updateCardArchivedStatus(cardId, false, cardOrder);
    initNewCardEvents(newCard, newCard.board_id);
}

function deleteButtonHandler(clickEvent) {
  let cardId = clickEvent.target.dataset.cardId;
  dataHandler.deleteCard(cardId);
  updateCardOrderAfterCardDelete(clickEvent);
  domManager.deleteElement(`.card[data-card-id="${cardId}"]`);
}

async function updateCardOrderAfterCardDelete(clickEvent) {
    const cardId = clickEvent.target.dataset.cardId;
    const cardOrder = clickEvent.target.parentElement.dataset.cardOrder;
    const boardId = clickEvent.target.parentElement.dataset.boardId;
    const statusId = clickEvent.target.closest('.card-slot').dataset.columnId;
    const cardData = {card_id: cardId, card_order: cardOrder, status_id: statusId, board_id: boardId};

    await dataHandler.updateCardOrderAfterCardDelete(cardData);
    dragHandler.updateOrderAttributes(boardId);
}

function changeCardTitle(clickEvent) {
  const cardId = clickEvent.target.getAttribute("card-title-id");
  const cardTitle = document.querySelector(`[card-title-id="${cardId}"]`);
  domManager.changeDomCardTitle(cardTitle);
}

function initNewCardEvents(card, boardId) {
    const cardBuilder = htmlFactory(htmlTemplates.card);
    const content = cardBuilder(card);
    domManager.addChild(`.board-columns[data-board-id="${boardId}"] .board-column[data-column-id="${card.status_id}"] .board-column-content`, content);
    domManager.addEventListener(
        `.card-archive[data-card-id="${card.id}"]`,
        "click",
        archiveButtonHandler
    );
    domManager.addEventListener(
        `.card-remove[data-card-id="${card.id}"]`,
        "click",
        deleteButtonHandler
    );
    domManager.addEventListener(
        `[card-title-id="${card.id}"]`,
        "click",
        changeCardTitle
    );
    dragHandler.initDraggable(document.querySelector(`.card[data-card-id="${card.id}"]`));
}

function initArchivedCardEvents(card, boardId) {
    const archiveBuilder = htmlFactory(htmlTemplates.archive);
    const content = archiveBuilder(card);
    domManager.addChild(`.board-archived-container[data-board-id="${boardId}"] .board-column-content`, content);
    domManager.addEventListener(
        `.card-unarchive[data-card-id="${card.id}"]`,
        "click",
        unarchiveButtonHandler
    );
    domManager.addEventListener(
        `.card-remove[data-card-id="${card.id}"]`,
        "click",
        deleteButtonHandler
    );
    domManager.addEventListener(
        `[card-title-id="${card.id}"]`,
        "click",
        changeCardTitle
    );
}
