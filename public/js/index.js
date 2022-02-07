import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateUserData } from './updateSetting';
import { bookTour } from './stripe';

////////dom///////
let map = document.getElementById('map');
let loginForm = document.querySelector('.form__login');
let updateUserPData = document.querySelector('.form-user-data');
let updateUserPassword = document.querySelector('.form-user-settings');
let logoutForm = document.querySelector('.nav__el--logout');
let getBookTour = document.getElementById('book-tour');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

if (map) {
    let locations = JSON.parse(map.dataset.locations);
    displayMap(locations);
}

if (logoutForm) {
    logoutForm.addEventListener('click', logout);
}
if (updateUserPData) {
    updateUserPData.addEventListener('submit', (e) => {
        e.preventDefault();
        let form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);

        updateUserData(form, 'data');
    });
}

if (updateUserPassword) {
    updateUserPassword.addEventListener('submit', (e) => {
        e.preventDefault();
        document.querySelector('.btn--update-satus').textContent =
            'Updateing...';
        const userPassword = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConformation =
            document.getElementById('password-confirm').value;
        updateUserData(
            { userPassword, password, passwordConformation },
            'password'
        );
        document.querySelector('.btn--update-satus').textContent =
            'Save Password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
}

if (getBookTour) {
    getBookTour.addEventListener('click', (e) => {
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        bookTour(tourId);
         e.target.textContent = 'Book Tour now!';
    });
}
