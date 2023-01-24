import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";
import {columnManager} from "./columnManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
        }
    },
    initNewBoardButton: function () {
      domManager.addEventListener(`#newBoard`, "click", addNewBoard);
    },
};

async function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    document.querySelector(`.board[data-board-id="${boardId}"] .board-header .board-toggle i`).classList.toggle('fa-chevron-down');
    document.querySelector(`.board[data-board-id="${boardId}"] .board-header .board-toggle i`).classList.toggle('fa-chevron-up');
    if (domManager.hasChildren(`.board[data-board-id="${boardId}"] .board-columns`)) {
        domManager.deleteChildren(`.board[data-board-id="${boardId}"] .board-columns`);
    } else {
        await columnManager.loadColumns(boardId);
        await cardsManager.loadCards(boardId);
    }
}

function addNewBoard() {
    console.log('test')
}
