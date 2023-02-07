export let modalManager = {
    init: function () {
        let modal = document.getElementById('modal');
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    },
    showModal: function () {
        let modal = document.getElementById('modal');
        modal.style.display = 'block';
    }
};

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}