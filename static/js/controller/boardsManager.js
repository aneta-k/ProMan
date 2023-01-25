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
            domManager.addEventListener(
                `.board-add[data-board-id="${board.id}"]`,
                'click',
                newCardFormBuilder
            )
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

async function addCardHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const title = clickEvent.target[0].value;
    const status = clickEvent.target[1].value;
    let newCard = await dataHandler.createNewCard(title, boardId, status, '1');
    domManager.deleteChildren(`#newFormField`);
}

async function newCardFormBuilder(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const content = `<br><form onsubmit="return false;" data-board-id="${boardId}">
                        <input type="text" placeholder="Card Title" required>
                        <select id="statuses">
                            
                        </select>
                        <button type="submit">Save</button>
                    </form>`;
    document.querySelector(`#newFormField`).innerHTML = content;
    const statuses = await dataHandler.getStatuses(boardId)
    const select = document.querySelector('#statuses');
    for (let status of statuses) {
        let option = document.createElement("option");
        option.value = status.id;
        option.text = status.title;
        select.appendChild(option);
    }
    domManager.addEventListener(`#newFormField form`, 'submit', addCardHandler);
}

function addNewBoard() {
    const content = `<form onsubmit="return false;">
                        <input type="text" placeholder="Board Title" required>
                        <button type="submit">Save</button>
                    </form>`;
    document.querySelector(`#newFormField`).innerHTML = content;
    domManager.addEventListener(`#newFormField form`, 'submit', submitNewBoard);
}

async function submitNewBoard(event) {
    const title = event.currentTarget[0].value;
    let board = (await dataHandler.createNewBoard(title))[0];
    const boardBuilder = htmlFactory(htmlTemplates.board);
    const content = boardBuilder(board);
    domManager.addChild("#root", content);
    domManager.addEventListener(
        `.toggle-board-button[data-board-id="${board.id}"]`,
        "click",
        showHideButtonHandler
    );
    domManager.deleteChildren(`#newFormField`);
}
