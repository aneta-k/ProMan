import {boardsManager} from "./controller/boardsManager.js";
import {userManager} from "./controller/userManager.js";
import {modalManager} from "./controller/modalManager.js";

function init() {
    boardsManager.loadBoards();
    boardsManager.initNewBoardButton();
    userManager.init();
    modalManager.init();
}

init();
