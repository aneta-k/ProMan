import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {dragHandler} from "../dragHandler.js";
import {modalManager} from "./modalManager.js";

export let columnManager = {
    loadColumns: async function (boardId) {
        const statuses = await dataHandler.getStatuses(boardId);
        for (let status of statuses) {
            const columnBuilder = htmlFactory(htmlTemplates.column);
            const content = columnBuilder(status, boardId);
            domManager.addChild(`.board-columns[data-board-id="${boardId}"]`, content);
            domManager.addEventListener(
                `.column-delete[data-column-id="${status.id}"]`,
                "click",
                deleteButtonHandler
            );
            const newestColumn = await document.querySelector(`.card-slot[data-column-id="${status.id}"]`);
            dragHandler.initDropzone(newestColumn);
            domManager.addEventListener(
                `.board-column-title[data-column-id="${status.id}"]`,
                "dblclick",
                domManager.changeDomColumnTitle
            );
        }
    },
    addDefaultColumns: async function (boardId) {
        for (let title of ['new', 'in progress', 'testing', 'done']) {
            await dataHandler.createNewColumn(boardId, title);
        }
    },
    addNewColumnHandler: async function(clickEvent) {
        const boardId = clickEvent.target.dataset.boardId;
        const title = clickEvent.target[0].value;
        await dataHandler.createNewColumn(boardId, title);
        modalManager.closeModal();
        if (! domManager.hasChildren(`.board[data-board-id="${boardId}"] .board-columns`)) {
            document.querySelector(`.toggle-board-button[data-board-id="${boardId}"]`).dispatchEvent(new Event('click'));
        }
    }
};

async function deleteButtonHandler(event) {
    let columnId = event.currentTarget.dataset.columnId;
    await dataHandler.deleteColumn(columnId);
    domManager.deleteElement(`.board-column[data-column-id="${columnId}"]`);
}