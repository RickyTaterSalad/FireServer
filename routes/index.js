var express = require('express');
var router = express.Router();


var router = require('express').Router();
router.use('/department', require('./department'));
router.use('/posts', require('./posts'));
router.use('/messages', require('./messages'));
router.use('/conversations', require('./conversations'));
router.use('/stations', require('./stations'));
router.use('/self', require('./self'));
router.use('/register', require('./register'));
router.use('/ahCodes', require('./assign-hire-code'));
router.use('/driveTime', require('./drive-times'));
router.get("/", function (req, res) {
    res.send("API");
});

module.exports = router;
