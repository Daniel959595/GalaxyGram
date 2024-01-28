(() => {

    // Useful global variables

    let wrapper;
    let loginForm;
    let registerForm;
    let registerLink
    let loginLink;
    let btnLogin;
    let btnRegister;
    let nameInputLogin;
    let passInputLogin;
    let nameInputRegister;
    let passInputRegister;
    let invalidNameLogin;
    let invalidPassLogin
    let invalidNameRegister;
    let invalidPassRegister;
    let loginError;
    let registerError;

    /**
     * Initialize the global variables
     * @type {initializeVariables}
     */
    const initializeVariables = () => {

        wrapper = document.querySelector('.wrapper');
        loginForm = document.getElementById('loginForm');
        registerForm = document.getElementById('registerForm');
        loginLink = document.querySelector('.login-link');
        registerLink = document.querySelector('.register-link');
        btnLogin = document.getElementById('btn-login');
        nameInputLogin = document.getElementById('nameLogin');
        invalidNameLogin = document.getElementById('invalidNameLogin');
        btnRegister = document.getElementById('btn-register');
        nameInputRegister = document.getElementById('nameRegister');
        loginError = document.getElementById('loginError');
        registerError = document.getElementById('registerError');


    }

    /**
     * Closure that responsible on the connection to the API server
     */
    const serverApi = (function () {

        /**
         * Submit the login form
         * @param event
         * @returns {Promise<void>}
         */
        const submitLogin = async function (event) {
            event.preventDefault();

            // Reset error section
            loginError.textContent = '';
            loginError.classList.add('d-none');

            const username = event.target.nameLogin.value.trim();
            const password = event.target.passLogin.value.trim();

            await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, password}),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}, ${response.message}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        // Login successful, redirect to the pictures page
                        window.location.href = '/pictures/home-page';
                        }
                    else {
                        // Login failed, display error message
                        loginError.textContent = data.message;
                        loginError.classList.toggle('d-none');
                    }
                })
                .catch(error => {
                    console.log(error.method);
                })

            // if (response.ok) {
            //     // Registration successful, redirect to the pictures page
            //     window.location.href = '/pictures/home-page';
            // } else {
            //     // Registration failed, display error message
            //     const data = await response.json();
            //     loginError.textContent = data.message;
            //     loginError.classList.toggle('d-none');
            // }
        }

        /**
         * Submit the registration form
         * @param event
         * @returns {Promise<void>}
         */
        const submitRegister = async function (event) {
            event.preventDefault();

            // Reset error section
            registerError.textContent = '';
            registerError.classList.add('d-none');

            const username = event.target.nameRegister.value.trim();
            const password = event.target.passRegister.value.trim();

            await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, password}),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}, ${response.message}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        // Registration successful, redirect to the pictures page
                        window.location.href = '/pictures/home-page';
                    }
                    else {
                        // Registration failed, display error message
                        registerError.textContent = data.message;
                        registerError.classList.toggle('d-none');
                    }
                })
                .catch(error => {
                    console.log(error.method);
                })
        }

        return {
            submitLogin: submitLogin,
            submitRegister: submitRegister
        }

    }) ()
    /**
     * Closure that responsible for the validation of the userName, password, etc...
     */
    const validations = (function () {

        /**
         * Checks if the username is valid
         */
        const checkUserName = function (event) {
            let value = event.target.value.trim();

            let nameInput = event.target.id === "nameLogin" ? nameInputLogin : nameInputRegister;

            const regex = /^[a-zA-Z0-9]{4,12}$/;

            if (!regex.test(value)) {
                nameInput.classList.add('invalid');
                nameInput.setCustomValidity('Letters and numbers only (4-12 characters).');
            } else {
                nameInput.classList.remove('invalid');
                nameInput.classList.remove('invalid-input');
                nameInput.setCustomValidity("");
            }
        }

        /**
         * Checks if the name and password are valid
         * @returns {boolean}
         */
        const chekNameAndPassword = function (event) {
            let inputToCheck = event.target.innerText === "Login" ? nameInputLogin : nameInputRegister;

            if (inputToCheck.classList.contains('invalid')) {
                inputToCheck.classList.add('invalid-input');
                if (inputToCheck.value === '')
                    inputToCheck.setCustomValidity('Please fill out this field.');
                else
                    inputToCheck.setCustomValidity('Letters and numbers only (4-12 characters).');
                return false;
            }

            return true;
        }

        return {
            checkUserName: checkUserName,
            chekNameAndPassword: chekNameAndPassword
        }

    }) ()

    /**
     * Closure that responsible on the visuals of the page
     * @type {visualEffects}
     */
    const visualEffects = (function () {

        /**
         * Add the class 'active' to the wrapper element
         */
        const addActive = function () {
            wrapper.classList.add('active');
        }

        /**
         * Remove the class 'active' from the wrapper element
         */
        const removeActive = function () {
            wrapper.classList.remove('active');
        }

        return {
            addActive: addActive,
            removeActive: removeActive
        }

    }) ()

    /**
     * upon loading the page, we bind listeners to certain objects
     */
    document.addEventListener("DOMContentLoaded", () => {

        initializeVariables();

        window.addEventListener('load', function () {

            registerLink.addEventListener('click', visualEffects.addActive);
            loginLink.addEventListener('click', visualEffects.removeActive);
            btnLogin.addEventListener('click', validations.chekNameAndPassword);
            nameInputLogin.addEventListener('input', validations.checkUserName);
            btnLogin.addEventListener('click', validations.chekNameAndPassword);
            nameInputRegister.addEventListener('input', validations.checkUserName);
            btnRegister.addEventListener('click', validations.chekNameAndPassword);
            loginForm.addEventListener('submit', serverApi.submitLogin);
            registerForm.addEventListener('submit', serverApi.submitRegister);

        }, false);


    });

})();
