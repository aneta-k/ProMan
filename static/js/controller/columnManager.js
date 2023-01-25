import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {dragHandler} from "../dragHandler.js";

export let columnManager = {
    loadColumns: async function (boardId) {
        const statuses = await dataHandler.getStatuses();
        for (let status of statuses) {
            const columnBuilder = htmlFactory(htmlTemplates.column);
            const content = columnBuilder(status);
            domManager.addChild(`.board-columns[data-board-id="${boardId}"]`, content);
        }
        let columns = document.getElementsByClassName('card-slot');
        for (let column of columns) {
            dragHandler.initDropzone(column);
        }
    },
};
