var express = require('express');
var router = express.Router();


var router = require('express').Router();

router.use('/users', require('./users'));
router.use('/departments', require('./departments'));
router.use('/posts', require('./posts'));
router.use('/messages', require('./messages'));
router.use('/conversations', require('./conversations'));
router.use('/stations', require('./stations'));
module.exports = router;