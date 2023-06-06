var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

// test webpage
router.get('/foo', (req,res,next)=>res.send('caught'))



module.exports = router;
