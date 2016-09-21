var debug = require('debug')('fireServer:server');
var validate = function (req, res, next) {
    if (req.user) {
        if (!req.locals) {
            req.locals = {};
        }
        req.locals.userId = req.user._id;
        next()
    }
    else {
        return res.status(401).send();
    }
};

module.exports = {
    validate: validate
};