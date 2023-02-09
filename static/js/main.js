import {boardsManager} from "./controller/boardsManager.js";
import {userManager} from "./controller/userManager.js";
import {modalManager} from "./controller/modalManager.js";
import {columnManager} from "./controller/columnManager.js";
import {cardsManager} from "./controller/cardsManager.js";
import {domManager} from "./view/domManager.js";


function init() {
    boardsManager.loadBoards();
    boardsManager.initNewBoardButton();
    userManager.init();
    modalManager.init();
}

init();

document.getElementById("refresh").addEventListener("click", function(){refresh_boards()});

setInterval(() => {refresh_boards()}, 5000)


function refresh_boards() {
  let openBoardsArray = clearTheBoards();
  domManager.deleteChildren(`.board-container`);
  init();
  setTimeout(() => {reOpenBoards(openBoardsArray)}, 50);
};

function clearTheBoards() {
  let openBoardsArray = [];
  let boards = document.getElementsByClassName("board-toggle toggle-board-button");
  for (let i = 0; i < boards.length; i++) {
    if (boards[i].children[0].className == "fas fa-chevron-up"){
      openBoardsArray.push(boards[i].attributes[1].value);
    }
  };
return openBoardsArray
};

async function reOpenBoards(openBoardsArray) {
  let newBoards = document.getElementsByClassName("board-toggle toggle-board-button");
  console.log(newBoards);
  for (let i = 0; i < newBoards.length; i++) {
    let boardId = newBoards[i].attributes[1].value;
    if (openBoardsArray.includes(newBoards[i].attributes[1].value))  {
      document.querySelector(`.toggle-board-button[data-board-id="${boardId}"]`).dispatchEvent(new Event('click'));
  }
  };
};




if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register("/service-worker.js", { scope: '/' }).then(
      registration => {
        console.log(`Service Worker registered! Scope: ${registration.scope}`);
      },
      error => {
        console.error(`Service Worker registration failed: ${error}`);
      },
    );
  });
}