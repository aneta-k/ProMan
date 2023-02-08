import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {dragHandler} from "../dragHandler.js";

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
};

function deleteButtonHandler(event) {
    let columnId = event.currentTarget.dataset.columnId;
    dataHandler.deleteColumn(columnId);
    domManager.deleteElement(`.board-column[data-column-id="${columnId}"]`);
}