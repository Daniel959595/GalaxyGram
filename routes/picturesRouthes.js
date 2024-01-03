const express = require('express');
const router = express.Router();

const picturesController = require('../controllers/PicturesController')

/**
 * Get the home page
 */
router.get('/home-page', picturesController.getHomePage);

module.exports = router;
