/**
 * Model that saves the comments data
 * @type {{}}
 */
const commentsModel = require('../models/CommentsModel');

/**
 * Adding new comment to the comments model
 * @param req
 * @param res
 */
exports.addComment = (req, res) => {
    try {
        const imgId = req.body.imgId;
        const commentId = `${new Date().toJSON().slice(0, 19)}+${req.session.username}`;

        const comment = {
            userName: req.session.username,
            text: req.body.comment,
            id: commentId,
            imgId: imgId
        };

        commentsModel.addComment(imgId, comment);

        res.status(200).json({ status: 'ok', message: 'Comment added successfully' });
    } catch (e) {
        console.error('Error adding comment:', e);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

/**
 * Deletes a comment from the comments model
 * @param req
 * @param res
 */
exports.deleteComment = (req, res) => {
    try {
        const imgId = req.body.imgId;
        const commentId = req.body.commentId;

        const comment = commentsModel.getComment(imgId, commentId);

        // Validate the comment ownership
        if (comment.userName === req.session.username) {
            commentsModel.deleteComment(imgId, commentId);
            res.status(200).json({ status: 'ok', message: 'Comment deleted successfully' });
        }
        else {
            res.status(200).json({ status: 'error', message: 'Failed to delete comment: not allowed' });
        }

    } catch (e) {
        console.error('Error deleting comment:', e);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }

}

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

        if(commentsForImgId) {
            // Check if the user is the owner of the comment
            commentsForImgId.forEach(comment => {
                if (comment.userName === req.session.username)
                    comment.isOwner = true;
                else
                    comment.isOwner = false;
            })

            res.status(200).json({success: true, comments: commentsForImgId});
        }
        else
            res.status(200).json({ success: false, message: 'No comments found for the specified imgId' });

    } catch (e) {
        console.error('Error adding comment:', e);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}
