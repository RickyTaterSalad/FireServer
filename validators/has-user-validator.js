const RequestHelperMethods = require("../util/request-helper-methods");
var debug = require('debug')('fireServer:server');
var validate = function (req, res, next) {
    if (req.user) {
        if(!req.locals){
            req.locals = {};
        }
        req.locals.userId = req.user._id;
        next()
    }
    else {
        debug("no user");
        res.json(RequestHelperMethods.noUserJson);
    }
};

module.exports = {
    validate: validate
};