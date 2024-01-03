/**
 * Model that saves the comments data
 * @type {{}}
 */
const commentsModel = require('../models/CommentsModel');

/**
 * Returns the home page
 * @param req
 * @param res
 */
exports.addComment = (req, res) => {
    try {
        const imgId = req.body.imgId;
        const comment = {
            userName: req.session.username,
            text: req.body.comment
        };

        commentsModel.addComment(imgId, comment);

        res.status(200).json({ status: 'ok', message: 'Comment added successfully' });
    } catch (e) {
        console.error('Error adding comment:', e);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

/**
 * Checks if there's new comments in the server
 * @param req
 * @param res
 */
exports.isNewComments = (req, res) => {
    try {
        const imgId = req.query.imgId;
        const lastUpdate = req.query.lastUpdate;

        let isNew = commentsModel.isNewComments(imgId, lastUpdate);

        res.status(200).json({ status: 'ok', isNew: isNew });
    } catch (e) {
        console.error('Error adding comment:', e);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

/**
 * Gets the comments data for a certain imgId
 */
exports.getComments = (req, res) => {
    try {
        const imgId = req.query.imgId;

        const commentsForImgId = commentsModel.getComments(imgId);

        if(commentsForImgId)
            res.status(200).json({ success: true, comments: commentsForImgId });
        else
            res.status(200).json({ success: false, message: 'No comments found for the specified imgId' });

    } catch (e) {
        console.error('Error adding comment:', e);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}
