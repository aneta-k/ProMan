export const htmlTemplates = {
    board: 1,
    card: 2,
    column: 3,
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.card]: cardBuilder,
    [htmlTemplates.column]: columnBuilder
};

export function htmlFactory(template) {
    if (builderFunctions.hasOwnProperty(template)) {
        return builderFunctions[template];
    }

    console.error("Undefined template: " + template);

    return () => {
        return "";
    };
}

function boardBuilder(board) {
    return `<section class="board" data-board-id="${board.id}">
                <div class="board-header">
                    <span class="board-title">${board.title}</span>
                    <button class="board-add">Add Card</button>
                    <button class="board-toggle toggle-board-button" data-board-id="${board.id}"><i class="fas fa-chevron-down"></i></button>
                </div>
                <div class="board-columns" data-board-id="${board.id}"></div>
            </section>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">
                <div class="card-remove" data-card-id="${card.id}"><i class="fas fa-trash-alt"></i></div>
                <div class="card-title">${card.title}</div>
            </div>`;
}

function columnBuilder(column) {
    return `<div class="board-column" data-column-id="${column.id}">
                <div class="board-column-title">${column.title}</div>
                <div class="board-column-content"></div>
            </div>`;
}