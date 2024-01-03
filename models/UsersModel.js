
const UserModel = (function () {

    // Simulating an in-memory database
    const users = [];

    // Constructor function for a user
    function User(username, password) {
        this.username = username;
        this.password = password;
    }

    const getUserByUsername = function (username) {
        // Retrieve a user by username from the database
        return users.find(user => user.username === username);
    };

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
        getUserByUsername: getUserByUsername,
        addUser: addUser
    }

})();

module.exports = UserModel;
