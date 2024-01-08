const express = require('express');
const router = express.Router();

const commentsController = require('../controllers/CommentsController')

/**
 * Post new comment
 */
router.post('/addComment', commentsController.addComment);

/**
 * Delete comment
 */
router.delete('/deleteComment', commentsController.deleteComment);

/**
 * Checks if there's new comments
 */
router.get('/isNewComments', commentsController.isNewComments);

/**
 * Gets the comments data for a certain imgId
 */
router.get('/getComments', commentsController.getComments);

module.exports = router;
