import {boardsManager} from "./controller/boardsManager.js";
import {userManager} from "./controller/userManager.js";

function init() {
    boardsManager.loadBoards();
    boardsManager.initNewBoardButton();
    userManager.init();
}

init();
