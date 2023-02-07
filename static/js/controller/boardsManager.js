import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import { columnManager } from "./columnManager.js";
import {modalManager} from "./modalManager.js";

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
        "click",
        newCardFormBuilder
      );
      domManager.addEventListener(
        `[board-title-id="${board.id}"]`,
        "click",
        changeBoardTitle
      );
      domManager.addEventListener(
                `.board-delete[data-board-id="${board.id}"]`,
                "click",
                deleteButtonHandler
            );
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
    } else {
        await columnManager.loadColumns(boardId);
        await cardsManager.loadCards(boardId);
    }
}

function showNewBoardModal() {
      const content = `<br><form onsubmit="return false;">
                        <input type="text" placeholder="Board Title" required>
                        <button type="submit">Save</button>
                    </form>`;
      document.getElementsByClassName('modal-header-text')[0].textContent = 'New Board';
      document.querySelector(`.modal-content`).innerHTML = content;
      domManager.addEventListener(`.modal-content form`, "submit", submitNewBoard);
      modalManager.showModal();
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
  const statuses = await dataHandler.getStatuses(boardId);
  const select = document.querySelector("#statuses");
  for (let status of statuses) {
    let option = document.createElement("option");
    option.value = status.id;
    option.text = status.title;
    select.appendChild(option);
  }
  domManager.addEventListener(`#newFormField form`, "submit", cardsManager.addCardHandler);
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
  domManager.addEventListener(
      `.board-delete[data-board-id="${board.id}"]`,
      "click",
      deleteButtonHandler
  );
  domManager.addEventListener(
        `.board-add[data-board-id="${board.id}"]`,
        "click",
        newCardFormBuilder
  );
  modalManager.closeModal();
}

function changeBoardTitle(clickEvent) {
  const boardTitleId = clickEvent.target.getAttribute("board-title-id");
  const boardTitle = document.querySelector(
    `[board-title-id="${boardTitleId}"]`
  );
  domManager.changeDomBoardTitle(boardTitle);
}


function deleteButtonHandler(clickEvent) {
    let boardId = clickEvent.target.dataset.boardId;
    dataHandler.deleteBoard(boardId);
    domManager.deleteElement(`.board[data-board-id="${boardId}"]`);
}
