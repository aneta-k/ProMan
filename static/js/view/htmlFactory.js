export const htmlTemplates = {
  board: 1,
  card: 2,
  column: 3,
};

export const builderFunctions = {
  [htmlTemplates.board]: boardBuilder,
  [htmlTemplates.card]: cardBuilder,
  [htmlTemplates.column]: columnBuilder,
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
                    <span class="board-title" board-title-id="${board.id}">${board.title}</span>
                    <button class="board-add-card" data-board-id="${board.id}">Add Card</button>
                    <button class="board-add-col" data-board-id="${board.id}">Add Column</button>
                    <button class="board-archived" data-board-id="${board.id}"><i class="fa-solid fa-boxes-packing"></i></button>
                    <button class="board-delete delete-board-button" data-board-id="${board.id}"><i class="fas fa-trash-alt"></i></button>
                    <button class="board-toggle toggle-board-button" data-board-id="${board.id}"><i class="fas fa-chevron-down"></i></button>
                </div>
                <div class="board-columns" data-board-id="${board.id}"></div>
            </section>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}" data-board-id="${card.board_id}" data-card-order="${card.card_order}">
                <div class="card-archive" data-card-id="${card.id}"><i class="fas fa-file-circle-xmark"></i></i></div>
                <div class="card-remove" data-card-id="${card.id}"><i class="fas fa-trash-alt"></i></div>
                <div class="card-title" card-title-id="${card.id}">${card.title}</div>
            </div>`;
}

function columnBuilder(column, boardId) {
    return `<div class="board-column card-slot" data-column-id="${column.id}" data-board-id="${boardId}">
                <div class="board-column-title">${column.title}</div>
                <div class="board-column-content"></div>
            </div>`;
}
