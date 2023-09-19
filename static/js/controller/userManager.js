import {modalManager} from "./modalManager.js";
import {dataHandler} from "../data/dataHandler.js";
import {domManager} from "../view/domManager.js";

export let userManager = {
  init: function () {
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const logoutButton = document.getElementById('logoutButton');

    if (loginButton && registerButton) {
      loginButton.addEventListener('click', showLoginModal);
      registerButton.addEventListener('click', showRegisterModal);
    } else if (logoutButton) {
      logoutButton.addEventListener('click', logout);
    }
  },
  isLoggedIn: function () {
    return (document.cookie.match('(^|;)\\s*' + 'logged_in' + '\\s*=\\s*([^;]+)')[2].toLowerCase() === 'true');
  }
};

function showModalWithContent(headerText, content, submitHandler) {
  document.getElementsByClassName('modal-header-text')[0].textContent = headerText;
  document.getElementsByClassName('modal-content')[0].innerHTML = content;
  if (submitHandler) {
    const form = document.querySelector('form');
    form.addEventListener('submit', submitHandler);
  }
  modalManager.showModal();
}

function showLoginModal() {
  const content = `
        <form id="loginForm" method="post" action="" onsubmit="return false;">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <p><button type="submit">Login</button></p>
        </form>
    `;
  showModalWithContent('Login', content, login);
}

function showRegisterModal() {
  const content = `
        <form id="registerForm" method="post" action="" onsubmit="return false;">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <p><button type="submit">Register</button></p>
        </form>
    `;
  showModalWithContent('Register', content, register);
}

async function login(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const response = await dataHandler.login(formData.get('username'), formData.get('password'));
  handleResponse(response, 'Incorrect login!');
}

async function register(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const response = await dataHandler.register(formData.get('username'), formData.get('password'));
  handleResponse(response, 'Username is already in use!');
}

function handleResponse(response, errorMessage) {
  if (response.ok) {
    window.location.reload();
  } else {
    document.getElementById('modalWarning').innerText = errorMessage;
    modalManager.showModalWarning();
  }
}

async function logout() {
    await dataHandler.logout();
    window.location.reload();
}