var router = require('express').Router();
const hasUser = require("../validators/has-user-validator").validate;
router.get('/', hasUser, function (req, res) {
    res.json(req.user);
});

module.exports = router;