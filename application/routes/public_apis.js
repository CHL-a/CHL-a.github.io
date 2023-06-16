var express = require('express');
var router = express.Router();

router.use('/roblox',require('./roblox/main'))

module.exports = router;