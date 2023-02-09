import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import { columnManager } from "./columnManager.js";
import {modalManager} from "./modalManager.js";
import {userManager} from "./userManager.js";

export let boardsManager = {
  loadBoards: async function () {
    const boards = await dataHandler.getBoards();
    for (let board of boards) {
      initBoardEvents(board);
    }
  },
  initNewBoardButton: function () {
    domManager.addEventListener(`#newBoard`, "click", showNewBoardModal);
  },
};

async function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    document.querySelector(`.board[data-board-id="${boardId}"] .board-header .board-toggle i`).classList.toggle('fa-chevron-down');
    document.querySelector(`.board[data-board-id="${boardId}"] .board-header .board-toggle i`).classList.toggle('fa-chevron-up');
    if (domManager.hasChildren(`.board[data-board-id="${boardId}"] .board-columns`)) {
        domManager.deleteChildren(`.board[data-board-id="${boardId}"] .board-columns`);
        if (domManager.hasChildren(`.board-archived-container[data-board-id="${boardId}"]`)) {
            domManager.deleteChildren(`.board-archived-container[data-board-id="${boardId}"]`);
        }
        if (document.querySelector(`form[data-board-id="${boardId}"]`)) {
            domManager.deleteChildren(`#newFormField`);
        }
    } else {
        await columnManager.loadColumns(boardId);
        await cardsManager.loadCards(boardId);
    }
}

function showNewBoardModal() {
    const content = `<form onsubmit="return false;">
                        <label>Title:</label>
                        <input type="text" placeholder="Board Title" required>
                        <br>
                        <br>
                        ` +
                        ((userManager.isLoggedIn()) ? `<label>Private:</label>
                        <input type="checkbox">
                        <br>
                        <br>
                        ` : ``)
                        + `<button type="submit">Save</button>
                    </form>`;
    document.getElementsByClassName('modal-header-text')[0].textContent = 'New Board';
    document.querySelector(`.modal-content`).innerHTML = content;
    domManager.addEventListener(`.modal-content form`, "submit", submitNewBoard);
    modalManager.showModal();
}

async function newCardModalBuilder(clickEvent) {
  const boardId = clickEvent.target.dataset.boardId;
  const boardTitle = document.querySelector(`.board-title[data-board-id="${boardId}"]`).innerHTML;
  const content = `<br><form onsubmit="return false;" data-board-id="${boardId}">
                        <label>Title:</label>
                        <input type="text" placeholder="Card Title" required>
                        <br>
                        <label>Column:</label>
                        <select id="statuses">
                        </select>
                        <br>
                        <br>
                        <button type="submit">Save</button>
                    </form>`;
  document.querySelector(`.modal-content`).innerHTML = content;
  document.getElementsByClassName('modal-header-text')[0].textContent = `New Card for ${boardTitle}`;
  const statuses = await dataHandler.getStatuses(boardId);
  const select = document.querySelector("#statuses");
  for (let status of statuses) {
    let option = document.createElement("option");
    option.value = status.id;
    option.text = status.title;
    select.appendChild(option);
  }
  domManager.addEventListener(
      `.modal-content form`,
      "submit",
      cardsManager.addCardHandler
  );

  if (! domManager.hasChildren(`.board[data-board-id="${boardId}"] .board-columns`)) {
      document.querySelector(`.toggle-board-button[data-board-id="${boardId}"]`).dispatchEvent(new Event('click'));
  }
  modalManager.showModal();
}

async function newColumnModalBuilder(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const boardTitle = document.querySelector(`.board-title[data-board-id="${boardId}"]`).innerHTML;
    const content = `<form onsubmit="return false;" data-board-id="${boardId}">
                        <label>Title:</label>
                        <input type="text" placeholder="Column Title" required>
                        <br>
                        <br>
                        <button type="submit">Save</button>
                    </form>`;
    document.getElementsByClassName('modal-header-text')[0].textContent = `New Column for ${boardTitle}`;
    document.querySelector(`.modal-content`).innerHTML = content;
    domManager.addEventListener(
        `.modal-content form`,
        "submit",
        columnManager.addNewColumnHandler
    );
    if (domManager.hasChildren(`.board[data-board-id="${boardId}"] .board-columns`)) {
        document.querySelector(`.toggle-board-button[data-board-id="${boardId}"]`).dispatchEvent(new Event('click'));
    }
    modalManager.showModal();
}

async function submitNewBoard(event) {
  const title = event.currentTarget[0].value;
  let privateBoard = false;
  if (userManager.isLoggedIn()) {privateBoard = event.currentTarget[1].value}
  let board = (await dataHandler.createNewBoard(title, privateBoard))[0];
  initBoardEvents(board);
  await columnManager.addDefaultColumns(board.id);
}

async function boardArchiveButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    if (domManager.hasChildren(`.board-archived-container[data-board-id="${boardId}"]`)) {
        domManager.deleteChildren(`.board-archived-container[data-board-id="${boardId}"]`);
    } else {
        document.querySelector(`.board-archived-container[data-board-id="${boardId}"]`).innerHTML = `
        <div class="board-columns-archive">
            <div class="board-column-archive">
                <div class="board-column-title">archived</div>
                <div class="board-column-content" data-board-id="${boardId}"></div>
            </div> 
        </div>`;

        if (! domManager.hasChildren(`.board[data-board-id="${boardId}"] .board-columns`)) {
            document.querySelector(`.toggle-board-button[data-board-id="${boardId}"]`).dispatchEvent(new Event('click'));
        }

        await cardsManager.loadArchivedCards(boardId);
    }
}

function deleteButtonHandler(clickEvent) {
    let boardId = clickEvent.target.dataset.boardId;
    dataHandler.deleteBoard(boardId);
    domManager.deleteElement(`.board[data-board-id="${boardId}"]`);
}

function initBoardEvents(board) {
    const boardBuilder = htmlFactory(htmlTemplates.board);
    const content = boardBuilder(board);
    domManager.addChild("#root", content);
    domManager.addEventListener(
        `.toggle-board-button[data-board-id="${board.id}"]`,
        "click",
        showHideButtonHandler
    );
    domManager.addEventListener(
        `.board-add-card[data-board-id="${board.id}"]`,
        "click",
        newCardModalBuilder
    );
    domManager.addEventListener(
        `.board-add-col[data-board-id="${board.id}"]`,
        "click",
        newColumnModalBuilder
    );
    domManager.addEventListener(
        `.board-archived[data-board-id="${board.id}"]`,
        "click",
        boardArchiveButtonHandler
    );
    domManager.addEventListener(
        `.board-title[data-board-id="${board.id}"]`,
        "dblclick",
        domManager.changeDomBoardTitle
    );
    domManager.addEventListener(
        `.board-delete[data-board-id="${board.id}"]`,
        "click",
        deleteButtonHandler
    );
    modalManager.closeModal();
}
