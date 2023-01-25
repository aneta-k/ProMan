import {dataHandler} from "./data/dataHandler.js";

export const dragHandler = {
     initDraggable(draggable) {
        draggable.setAttribute("draggable", true);
        draggable.addEventListener("dragstart", handleDragStart);
        draggable.addEventListener("dragend", handleDragEnd);
     },
    initDropzone(dropzone) {
        dropzone.addEventListener("dragenter", handleDragEnter);
        dropzone.addEventListener("dragover", handleDragOver);
        dropzone.addEventListener("dragleave", handleDragLeave);
        dropzone.addEventListener("drop", handleDrop);
     },
};

const dom = {
    isEmpty: function (el) {
        return el.children.length === 0;
    },
    hasClass: function (el, cls) {
        return el.classList.contains(cls);
    },
};


const page = {
    dragged: null,
};


function handleDragStart(e) {
    page.dragged = e.currentTarget;
    page.dragged.classList.add('card-dragged')

    console.log("Drag start of", page.dragged);
}

function handleDragEnd() {
    console.log("Drag end of", page.dragged);
    page.dragged.classList.remove('card-dragged')

    page.dragged = null;
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    console.log("Drag enter of", e.currentTarget);
}

function handleDragLeave(e) {
    console.log("Drag leave of", e.currentTarget);
    let dropzone = e.currentTarget;
    if (dropzone.classList.contains('card-slot')) {
        dropzone.classList.remove('card-slot-enter-highlighted');
    } else {
        dropzone.classList.remove('mixed-cards-enter-highlighted');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const dropzone = e.currentTarget;
    console.log("Drop of", dropzone);

    if (dom.hasClass(dropzone, "card-slot") && page.dragged.getAttribute('data-board-id') === dropzone.parentNode.getAttribute('data-board-id')) {
        dropzone.appendChild(page.dragged);
        dataHandler.updateCardStatus(page.dragged.getAttribute('data-card-id'), dropzone.parentNode.getAttribute('data-column-id'));
    }
}
