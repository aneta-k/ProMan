export let modalManager = {
    init: function () {
        window.onclick = function(event) {
            if (event.target === modal) {
                modalManager.closeModal();
            }
        }
    },
    showModal: function () {
        let modal = document.getElementById('modal');
        modal.style.display = 'block';
    },
    closeModal: function () {
        modalManager.hideModalWarning();
        document.getElementById('modal').style.display = 'none';
    },
    showModalWarning: function () {
        document.getElementById('modalWarning').style.display = 'block';
    },
    hideModalWarning: function () {
        document.getElementById('modalWarning').style.display = 'none';
    },
};
