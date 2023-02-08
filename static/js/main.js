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
  domManager.deleteChildren(`.board-container`);
  init();
}