const express = require('express')
const router = express.Router()

router.get(
	'/',
	(req,res)=>
		res.status(302)
		.json({
			id_type: req.old_type,
			url: req.location_url,
			id: req.id
		})
)

router.get(
	'/redirect',

	(req,res)=>
		res.redirect(req.location_url)
)

router.get(
	'/view', 

	(req,res)=>
		res.render('simple_img',{
			img_src: req.location_url
		})
)

module.exports = router