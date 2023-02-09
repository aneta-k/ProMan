export let historyManager = {
    addCard: function (text) {
        const history = document.querySelector(`.history-content`);
        let card = document.createElement('div');
        card.classList.add('history-card');
        card.innerText = text;
        history.prepend(card);
    }
};