const express = require('express');
const router = express.Router();

const authController = require('../controllers/AuthController')

/**
 * Get the home page
 */
router.get('/', authController.getLoginPage);

/**
 * Sends the login data to the authentication controller
 */
router.post('/login', authController.login);

/**
 * Sends the registration data to the authentication controller
 */
router.post('/register', authController.register);

module.exports = router;
