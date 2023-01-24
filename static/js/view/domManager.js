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
            parent.innerHTML = '';
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
};
