export let domManager = {
  addChild(parentIdentifier, childContent) {
    const parent = document.querySelector(parentIdentifier);
    if (parent) {
      parent.insertAdjacentHTML("beforeend", childContent);
    } else {
      console.error("could not find such html element: " + parentIdentifier);
    }
  },
  addEventListener(parentIdentifier, eventType, eventHandler) {
    const parent = document.querySelector(parentIdentifier);
    if (parent) {
      parent.addEventListener(eventType, eventHandler);
    } else {
      console.error("could not find such html element: " + parentIdentifier);
    }
  },
  hasChildren(elementIdentifier) {
    const parent = document.querySelector(elementIdentifier);
    if (parent) {
      return parent.hasChildNodes();
    } else {
      console.error("could not find such html element: " + elementIdentifier);
    }
  },
  deleteChildren(elementIdentifier) {
    const parent = document.querySelector(elementIdentifier);
    if (parent) {
      parent.innerHTML = "";
    } else {
      console.error("could not find such html element: " + elementIdentifier);
    }
  },
  deleteElement(elementIdentifier) {
    const parent = document.querySelector(elementIdentifier);
    if (parent) {
      parent.remove();
    } else {
      console.error("could not find such html element: " + elementIdentifier);
    }
  },

  changeDomBoardTitle(boardTitle) {
    boardTitle.onclick = function () {
      console.log(
        "kliknął Pan w " +
          boardTitle.innerText +
          ", następnym razem proszę bardziej uważać."
      );
      const inputText = document.createElement("input");
      inputText.setAttribute("type", "text");
      inputText.setAttribute("id", "tempTextBox");
      inputText.setAttribute("value", boardTitle.innerText);
      console.log(inputText);

      const saveButton = document.createElement("button");
      saveButton.setAttribute("type", "button");
      saveButton.setAttribute("id", "saveButton");
      saveButton.setAttribute("value", "Save");
      saveButton.setAttribute("class", "Button");
      saveButton.innerText = "Save";

      const textSpace = boardTitle.nextSibling;
      console.log("siotra" + textSpace);

      boardTitle.replaceWith(inputText);
      textSpace.replaceWith(saveButton);
    };
    return boardTitle;
  },

  saveDomBoardTitle(boardTitle) {
    const inputText = document.getElementById("tempTextBox");
    const saveButton = document.getElementById("saveButton");
    const textSpace = " ";
    boardTitle.innerText = inputText.value;
    inputText.replaceWith(boardTitle);
    saveButton.replaceWith(textSpace);
  },
};
