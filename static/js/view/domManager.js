import { dataHandler } from "../data/dataHandler.js";

function getElement(elementIdentifier) {
  const element = document.querySelector(elementIdentifier);
  if (!element) {
    console.error("could not find such html element: " + elementIdentifier);
  }
  return element;
}

export let domManager = {
  addChild(parentIdentifier, childContent) {
    const parent = getElement(parentIdentifier);
    if (parent) {
      parent.insertAdjacentHTML("beforeend", childContent);
    }
  },
  addEventListener(parentIdentifier, eventType, eventHandler) {
    const parent = getElement(parentIdentifier);
    if (parent) {
      parent.addEventListener(eventType, eventHandler);
    }
  },
  hasChildren(elementIdentifier) {
    const element = getElement(elementIdentifier);
    return element && element.hasChildNodes();
  },
  deleteChildren(elementIdentifier) {
    const element = getElement(elementIdentifier);
    if (element) {
      element.innerHTML = "";
    }
  },
  deleteElement(elementIdentifier) {
    const element = getElement(elementIdentifier);
    if (element) {
      element.remove();
    }
  },
  changeDomBoardTitle(clickEvent) {
    const boardTitle = clickEvent.target;
    const inputText = document.createElement("input");
    inputText.setAttribute("type", "text");
    inputText.setAttribute("id", "tempTextBox");
    inputText.setAttribute("value", boardTitle.innerText);
    inputText.classList.add('board-title');
    const saveButton = document.createElement("button");
    saveButton.setAttribute("type", "button");
    saveButton.setAttribute("id", "saveButton");
    saveButton.setAttribute("value", "Save");
    saveButton.style.marginRight = '5px';
    saveButton.innerText = "Save";
    const textSpace = boardTitle.nextSibling;
    boardTitle.replaceWith(inputText);
    textSpace.replaceWith(saveButton);
    inputText.focus();
    inputText.setSelectionRange(inputText.value.length, inputText.value.length);

    saveButton.addEventListener("click", async function (e) {
      const textSpace = " ";
      const boardId = boardTitle.dataset.boardId;
      boardTitle.innerText = inputText.value;
      inputText.replaceWith(boardTitle);
      saveButton.replaceWith(textSpace);
      await dataHandler.changeBoardTitleApi(boardId, inputText.value);
    });
  },
  changeDomCardTitle(cardTitle) {
    cardTitle.onclick = function () {
      const inputText = document.createElement("input");
      inputText.setAttribute("type", "text");
      inputText.setAttribute("id", "tempTextBox");
      inputText.setAttribute("value", cardTitle.innerText);
      cardTitle.replaceWith(inputText);
      inputText.focus();
      inputText.setSelectionRange(inputText.value.length, inputText.value.length);

      inputText.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          const inputText = document.getElementById("tempTextBox");
          const cardID = cardTitle.getAttribute("card-title-id");
          console.log(cardID);
          cardTitle.innerText = inputText.value;
          inputText.replaceWith(cardTitle);
          dataHandler.changeCardTitleApi(cardID, inputText.value);
        } else if (e.key === "Escape") {
          inputText.replaceWith(cardTitle);
        }
        document.addEventListener("click", function (e) {
          if (!inputText.contains(e.target)) {
            inputText.replaceWith(cardTitle);
          }
        });
      });
    };
  },
  changeDomColumnTitle(clickEvent) {
    const columnTitle = clickEvent.target;
    const inputText = document.createElement("input");
    inputText.setAttribute("type", "text");
    inputText.setAttribute("id", "tempTextBox");
    inputText.setAttribute("value", columnTitle.innerText);
    columnTitle.replaceWith(inputText);
    inputText.focus();
    inputText.setSelectionRange(inputText.value.length, inputText.value.length);

    inputText.addEventListener("keydown", async function (e) {
      if (e.key === "Enter") {
        const columnId = columnTitle.dataset.columnId;
        columnTitle.innerText = inputText.value;
        inputText.replaceWith(columnTitle);
        await dataHandler.changeColumnTitleApi(columnId, inputText.value);
      } else if (e.key === "Escape") {
        inputText.replaceWith(columnTitle);
      }
      document.addEventListener("click", function (e) {
        if (!inputText.contains(e.target)) {
          inputText.replaceWith(columnTitle);
        }
      });
    });
  },
};
