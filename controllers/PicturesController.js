
const path = require("path");
/**
 * Returns the home page
 * @param req
 * @param res
 */
exports.getHomePage = (req,res) => {
    res.sendFile(path.resolve('views/home-page.html'));
}