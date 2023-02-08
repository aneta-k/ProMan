import {modalManager} from "./modalManager.js";
import {dataHandler} from "../data/dataHandler.js";
import {domManager} from "../view/domManager.js";

export let userManager = {
  init: function () {
      try {
          document.getElementById('loginButton').addEventListener('click', showLoginModal);
          document.getElementById('registerButton').addEventListener('click', showRegisterModal);
      } catch (TypeError) {
          document.getElementById('logoutButton').addEventListener('click', logout);
      }
  },
    isLoggedIn: function () {
      return (document.cookie.match('(^|;)\\s*' + 'logged_in' + '\\s*=\\s*([^;]+)')[2].toLowerCase() === 'true');
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

async function login(event) {
    const username = event.currentTarget[0].value;
    const password = event.currentTarget[1].value;
    const response = await dataHandler.login(username, password);
    if (response === 200) {
        window.location.reload();
    } else if (response === 401) {
        document.getElementById('modalWarning').innerText = 'Incorrect login!';
        modalManager.showModalWarning();
    }
}

async function register(event) {
    const username = event.currentTarget[0].value;
    const password = event.currentTarget[1].value;
    const response = await dataHandler.register(username, password);
    if (response === 200) {
        window.location.reload();
    } else if (response === 409) {
        document.getElementById('modalWarning').innerText = 'Username is already in use!';
        modalManager.showModalWarning();
    }
}

async function logout() {
    await dataHandler.logout();
    window.location.reload();
}