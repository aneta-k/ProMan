// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    loadBoards: function() {
        dataHandler.getBoards(boards => {
            this._displayBoards(boards);
        });
    },
    _displayBoards: function(boards) {
        const boardList = boards.map(board => `<li>${board.title}</li>`).join('');
        const outerHtml = `
            <ul class="board-container">
                ${boardList}
            </ul>
        `;

        const boardsContainer = document.querySelector('#boards');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
    },
};
