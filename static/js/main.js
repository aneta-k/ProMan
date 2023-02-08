import {boardsManager} from "./controller/boardsManager.js";
import {userManager} from "./controller/userManager.js";
import {modalManager} from "./controller/modalManager.js";
import {domManager} from "./view/domManager.js";

function init() {
    boardsManager.loadBoards();
    boardsManager.initNewBoardButton();
    userManager.init();
    modalManager.init();
}

init();

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

document.getElementById("refresh").addEventListener("click", function(){refresh_boards()});


function refresh_boards() {
  let openBoardsArray = clearTheBoards();
  domManager.deleteChildren(`.board-container`);
  init();
  setTimeout(() => {reOpenBoards(openBoardsArray)}, 2000);
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


function reOpenBoards(openBoardsArray) {
  console.log("openBoardsArray");
  console.log(openBoardsArray);
  let newBoards = document.getElementsByClassName("board-toggle toggle-board-button");
  console.log("boards");
  console.log(newBoards);
  console.log(newBoards.length);
  console.log(newBoards[1]);
  for(let br in newBoards){
    let trrr = newBoards[br];
    console.log(trrr);
    
  }

  for (let i = 0; i < newBoards.length; i++) {
    console.log(newBoards);
    
    if (openBoardsArray.includes(newBoards[i].attributes[1].value)) {
      newBoards[i].children[0].className = "fas fa-chevron-up";
    }
  };
};