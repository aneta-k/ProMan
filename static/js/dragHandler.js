import {dataHandler} from "./data/dataHandler.js";

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
    async updateOrderAttributes(boardId) {
        const newCardsData = await dataHandler.getCardsByBoardId(boardId, false);
        const allCardsElements = document.querySelectorAll('.card');
        for (let card of allCardsElements){
            const matchingCard = newCardsData.find(x => x.id === Number(card.dataset.cardId));
            if (matchingCard) {
                card.dataset.cardOrder = matchingCard.card_order;
            }
        }
    }
};

function handleDragStart(e) {
    page.dragged = e.currentTarget;
    page.dragged.classList.add('card-dragged')
}

function handleDragEnd() {
    page.dragged.classList.remove('card-dragged')
    page.dragged = null;
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    // console.log("Drag enter of", e.currentTarget);
}

function handleDragLeave(e) {
    const dropzone = e.currentTarget;
    if (dropzone.classList.contains('card-slot')) {
        dropzone.classList.remove('card-slot-enter-highlighted');
    } else {
        dropzone.classList.remove('mixed-cards-enter-highlighted');
    }
}

async function handleDrop(e) {
    e.preventDefault();
    const dropzone = e.currentTarget;

    const oldOrder = page.dragged.dataset.cardOrder;
    const oldStatus = page.dragged.parentElement.parentElement.dataset.columnId;
    const newStatus = dropzone.dataset.columnId;

    if (dom.hasClass(dropzone, "card-slot") && page.dragged.getAttribute('data-board-id') === dropzone.dataset.boardId) {
        dataHandler.updateCardStatus(page.dragged.dataset.cardId, newStatus);
        if (e.target.draggable || e.target.parentElement.draggable) {   // div with .card or div with .card-title
            const passedCard = dom.hasClass(e.target, 'card') ? e.target : e.target.parentElement;
            const newOrder = (newStatus === oldStatus && oldOrder < passedCard.dataset.cardOrder) ? passedCard.dataset.cardOrder - 1 : passedCard.dataset.cardOrder;
            dropzone.children[1].insertBefore(page.dragged, passedCard);
            await dataHandler.updateCardsOrder(page.dragged.dataset.cardId, {new_card_order:newOrder, old_card_order:oldOrder, board_id:dropzone.dataset.boardId, new_status:newStatus, old_status:oldStatus});
        } else {
            const newOrder = newStatus !== oldStatus ? dropzone.children[1].childElementCount + 1 : dropzone.children[1].childElementCount;
            dropzone.children[1].appendChild(page.dragged);
            await dataHandler.updateCardsOrder(page.dragged.dataset.cardId, {new_card_order:newOrder, old_card_order:oldOrder, board_id:dropzone.dataset.boardId, new_status:newStatus, old_status:oldStatus});
        }
        dragHandler.updateOrderAttributes(dropzone.dataset.boardId);
    }
}
