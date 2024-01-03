/**
 * Model that responsible on the comments handling
 * @type {{addComment: addComment}}
 */
const CommentsModel = (function () {

    // Simulating an in-memory database
    let commentsData = {};

    // Save the time of the last update to a certain img
    let lastUpdateTimes = {};

    /**
     * Add new comment to the memory
     * @param imgId
     * @param comment
     */
    const addComment = function (imgId, comment) {

        if (!commentsData[imgId]) {
            commentsData[imgId] = [];
        }

        commentsData[imgId].push(comment);

        const updateTime = new Date().toJSON().slice(0, 19);

        lastUpdateTimes[imgId] = updateTime;
    }

    /**
     * Checks if there is new comments since last update
     * @param imgId The id of the image we want to check
     * @param lastUpdate The last time we updated the client side
     * @returns {boolean} true if there is new comments, false if not
     */
    const isNewComments = function (imgId, lastUpdate) {

        if (lastUpdateTimes.hasOwnProperty(imgId)) {
            const lastUpdateTime = lastUpdateTimes[imgId];

            return new Date(lastUpdateTime) > new Date(lastUpdate);
        } else {
            // If imgId doesn't exist, it means no new updates
            return false;
        }

    }

    /**
     * Gets the comments data for the imgId
     * @param imgId
     * @returns {*}
     */
    const getComments = function (imgId) {
        return commentsData[imgId];
    }

    return {
        addComment: addComment,
        isNewComments: isNewComments,
        getComments: getComments
    }

})()

module.exports = CommentsModel;