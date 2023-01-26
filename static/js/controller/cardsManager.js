import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { dragHandler } from "../dragHandler.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            domManager.addChild(`.board-columns[data-board-id="${boardId}"] .board-column[data-column-id="${card.status_id}"] .board-column-content`, content);
            domManager.addEventListener(
                `.card-remove[data-card-id="${card.id}"]`,
                "click",
                deleteButtonHandler
            );
            domManager.addEventListener(
                `[data-card-id="${card.id}"]`,
                "click",
                changeCardTitle
            );
            dragHandler.initDraggable(document.querySelector(`.card[data-card-id="${card.id}"]`));
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
        if (domManager.hasChildren(`.board[data-board-id="${boardId}"] .board-columns`)) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(newCard);
            domManager.addChild(`.board-columns[data-board-id="${boardId}"] .board-column[data-column-id="${newCard.status_id}"] .board-column-content`, content);
            domManager.addEventListener(
                `.card-remove[data-card-id="${newCard.id}"]`,
                "click",
                deleteButtonHandler
            );
            domManager.addEventListener(
                `[data-card-id="${newCard.id}"]`,
                "click",
                changeCardTitle
            );
            dragHandler.initDraggable(document.querySelector(`.card[data-card-id="${newCard.id}"]`));
        }
    },
};

function deleteButtonHandler(clickEvent) {
  let cardId = clickEvent.target.dataset.cardId;
  dataHandler.deleteCard(cardId);
  domManager.deleteElement(`.card[data-card-id="${cardId}"]`);
}

function changeCardTitle(clickEvent) {
  const cardId = clickEvent.target.getAttribute("data-card-id");
  const cardTitle = document.querySelector(`[data-card-id="${cardId}"]`);
  domManager.changeDomCardTitle(cardTitle);
}
