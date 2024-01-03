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

    // Extract form data from the request
    const { username, password } = req.body;

    // Check if the username already exists
    if (userModel.getUserByUsername(username)) {
        return res.status(400).json({ message: 'Username already exists.' });
    }

    userModel.addUser(username, password);

    req.session.isLoggedIn = true;
    req.session.username = username;

    // Perform additional validation and registration logic
    // (e.g., password strength, saving user to the database)

    // Assuming registration is successful, redirect to the pictures page
    res.status(200).json({ message: 'Registration successful.' });

};