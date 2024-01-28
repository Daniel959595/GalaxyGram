/**
 * Model that holds all the users data
 * @type {{checkUser: ((function(*): boolean)|*), addUser: (function(*, *): User)}}
 */
const UserModel = (function () {

    // Simulating an in-memory database
    const users = [];

    /**
     * Constructor function for a user
     * @param username
     * @param password
     * @constructor
     */
    function User(username, password) {
        this.username = username;
        this.password = password;
    }

    /**
     * Checks if the user data is correct
     * @param username
     * @returns {boolean}
     */
    const checkUser = function (user) {
        if (!findUser(user.username) || !checkPassword(user))
            return false;
        return true;
    };

    /**
     * Return the user Data
     * @param username
     * @returns the user data. Otherwise, undefined
     */
    const findUser = function (username) {
        return users.find(user => user.username === username);
    }

    /**
     * Checks if the user's password is correct
     * @param userToCheck
     * @returns {boolean}
     */
    const checkPassword = function (userToCheck) {
        if (users.find(user => user.username === userToCheck.username).password !== userToCheck.password)
            return false;
        return true;
    }

    /**
     * Add user to the memory
     * @param username
     * @param password
     * @returns {User} the user created
     */
    const addUser = function (username, password) {
        // Add a new user to the database
        const newUser = new User(username, password);
        users.push(newUser);
        return newUser;
    };

    const authenticateUser = function (username, password) {
        // Authenticate a user by checking username and password
        const user = this.getUserByUsername(username);

        if (user && user.password === password) {
            return user;
        }

        return null; // Authentication failed
    };

    const deleteUser = function (username) {
        // Delete a user from the database
        const index = users.findIndex(user => user.username === username);

        if (index !== -1) {
            users.splice(index, 1);
        }
    };

    // Public methods for the UserModel
    return {
        checkUser: checkUser,
        findUser: findUser,
        addUser: addUser
    }

})();

module.exports = UserModel;
