import {modalManager} from "./modalManager.js";
import {dataHandler} from "../data/dataHandler.js";
import {domManager} from "../view/domManager.js";

export let userManager = {
  init: function () {
    document.getElementById('loginButton').addEventListener('click', showLoginModal);
    document.getElementById('registerButton').addEventListener('click', showRegisterModal);
  }
};

function showLoginModal() {
  document.getElementsByClassName('modal-header-text')[0].textContent = 'Login';
  document.getElementsByClassName('modal-content')[0].innerHTML = `
        <form id="loginForm" method="post" action="" onsubmit="return false;">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <p><button type="submit">Login</button></p>
        </form>
      `;
  domManager.addEventListener(`#loginForm`, 'submit', login)
  modalManager.showModal();
}

function showRegisterModal() {
  document.getElementsByClassName('modal-header-text')[0].textContent = 'Register';
  document.getElementsByClassName('modal-content')[0].innerHTML = `
        <form id="registerForm" method="post" action="" onsubmit="return false;">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <p><button type="submit">Register</button></p>
        </form>
      `;
  domManager.addEventListener(`#registerForm`, 'submit', register)
  modalManager.showModal();
}

function login(event) {
    const username = event.currentTarget[0].value;
    const password = event.currentTarget[1].value;
    dataHandler.login(username, password);
    window.location.reload();
}

async function register(event) {
    const username = event.currentTarget[0].value;
    const password = event.currentTarget[1].value;
    await dataHandler.register(username, password);
    window.location.reload();
}