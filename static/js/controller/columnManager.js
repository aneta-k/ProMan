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
        }
        let columns = document.getElementsByClassName('card-slot');
        for (let column of columns) {
            dragHandler.initDropzone(column);
        };
        let columnTitles = await document.getElementsByClassName('board-column-title');
        for (let columnTitle of columnTitles) {
            domManager.addEventListener(
                `[data-column-title-id="${columnTitle.attributes[1].nodeValue}"]`,
                "click",
                changeColumnTitle
              );
        }
    },
};


function changeColumnTitle(clickEvent) {
   
    const columnTitleId = clickEvent.target.getAttribute("data-column-title-id");
    console.log(columnTitleId); 
    const columnTitle = document.querySelector(
      `[data-column-title-id="${columnTitleId}"]`
    );
    console.log(columnTitle);
    
    domManager.changeDomColumnTitle(columnTitle);
  }

function deleteButtonHandler(event) {
    let columnId = event.currentTarget.dataset.columnId;
    dataHandler.deleteColumn(columnId);
    domManager.deleteElement(`.board-column[data-column-id="${columnId}"]`);
}