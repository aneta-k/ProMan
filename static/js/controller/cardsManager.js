import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {dragHandler} from "../dragHandler.js";

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
            dragHandler.initDraggable(document.querySelector(`.card[data-card-id="${card.id}"]`));
        }
    },
};

function deleteButtonHandler(clickEvent) {
    let cardId = clickEvent.target.dataset.cardId;
    dataHandler.deleteCard(cardId);
    domManager.deleteElement(`.card[data-card-id="${cardId}"]`);
}
