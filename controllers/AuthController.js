/**
 * Model that holds the users data
 * @type {{getUserByUsername: function(*): T, authenticateUser: function(*, *): (*|null), addUser: function(*, *): User, deleteUser: function(*): void}|{}}
 */
const userModel = require('../models/UsersModel');

/**
 * Returns the home page
 * @param req
 * @param res
 */
exports.getLoginPage = (req, res) => {
    res.render('index', { title: 'Login' });
};

/**
 * Handle login logic
 * @param req
 * @param res
 */
exports.login = (req, res) => {
    //res.send(`Hello ${req.body.nameLogin}, password = ${req.body.passLogin} !`);

    try {
        // Extract form data from the request
        const user = { username, password } = req.body;

        // Check if the username not exists
        if (!userModel.checkUser(user)) {
            return res.status(200).json({ success: false ,message: 'Username or Password isn\'t correct.' });
        }

        // Update the session
        req.session.isLoggedIn = true;
        req.session.username = user.username;

        // After successful login, redirect to the pictures page
        res.status(200).json({ success: true ,message: 'Login successful.' });

    }
    catch (e) {
        res.status(400).json({ message: 'Bad input' });
    }

};

/**
 * Handle Registration logic
 * @param req
 * @param res
 */
exports.register = (req, res) => {
    try {
        // Extract form data from the request
        const user = { username, password } = req.body;

        // Check if the username already exists
        if (userModel.findUser(user.username) != undefined) {
            return res.status(200).json({ success: false ,message: 'Username already exist.' });
        }


        // Perform additional validation and registration logic
        // (e.g., password strength, saving user to the database)

        userModel.addUser(username, password);

        // Update the session
        req.session.isLoggedIn = true;
        req.session.username = user.username;

        // After successful registration, redirect to the pictures page
        res.status(200).json({ success: true ,message: 'Registration successful.' });
    }
    catch (e) {
        res.status(400).json({ message: 'Bad input' });
    }
}