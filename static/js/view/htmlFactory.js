export const htmlTemplates = {
  board: 1,
  card: 2,
  column: 3,
  archive: 4,
};

export const builderFunctions = {
  [htmlTemplates.board]: boardBuilder,
  [htmlTemplates.card]: cardBuilder,
  [htmlTemplates.column]: columnBuilder,
  [htmlTemplates.archive]: archiveBuilder,
};

export function htmlFactory(template) {
  if (builderFunctions.hasOwnProperty(template)) {
    return builderFunctions[template];
  }

  console.error("Undefined template: " + template);
  return () => "";
}

function boardBuilder(board) {
  return `<section class="board" data-board-id="${board.id}">
                <div class="board-header">
                    <span class="board-title" data-board-id="${board.id}">${board.title}</span>
                    <button class="board-add-card" data-board-id="${board.id}">Add Card</button>
                    <button class="board-add-col" data-board-id="${board.id}">Add Column</button>
                    <button class="board-archived" data-board-id="${board.id}"><i class="fas fa-boxes-packing"></i></button>
                    <button class="board-delete delete-board-button" data-board-id="${board.id}"><i class="fas fa-trash-alt"></i></button>
                    <button class="board-toggle toggle-board-button" data-board-id="${board.id}"><i class="fas fa-chevron-down"></i></button>
                </div>
                <div class="board-columns" data-board-id="${board.id}"></div>
                <div class="board-archived-container" data-board-id="${board.id}"></div>
            </section>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}" data-board-id="${card.board_id}" data-card-order="${card.card_order}">
                <div class="card-archive" data-card-id="${card.id}"><i class="fas fa-file-circle-xmark"></i></div>
                <div class="card-remove" data-card-id="${card.id}"><i class="fas fa-trash-alt"></i></div>
                <div class="card-title" card-title-id="${card.id}">${card.title}</div>
            </div>`;
}

function columnBuilder(column, boardId) {
    return `<div class="board-column card-slot" data-board-id="${boardId}" data-column-id="${column.id}">
                <span class="board-column-header">
                  <div class="board-column-title" data-column-id="${column.id}">${column.title}</div>
                  <span class="column-delete" data-column-id="${column.id}"><i class="fas fa-trash-alt column-delete"></i></span> 
                </span>
                <div class="board-column-content"></div>
            </div>`;
}

function archiveBuilder(card) {
    return `<div class="card" data-card-id="${card.id}" data-column-id="${card.status_id}" data-board-id="${card.board_id}">
                <div class="card-unarchive" data-card-id="${card.id}"><i class="fas fa-arrow-turn-up"></i></i></div>
                <div class="card-remove" data-card-id="${card.id}"><i class="fas fa-trash-alt"></i></div>
                <div class="card-title" card-title-id="${card.id}">${card.title}</div>
            </div>`;
}
