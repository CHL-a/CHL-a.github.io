const express = require('express')
const router = express.Router()
const roblox_middleware = require('../middleware/roblox')

// face, decal, image to image id
router.get(
	'/toImage/:id(\\d+)', 
	(req,_,next)=>{req.id = req.params.id,next()},
	roblox_middleware.getIdInformation,
	roblox_middleware.isValidForImageRequest,
	roblox_middleware.getAssetUrl,
	roblox_middleware.sendImageUrlToRouter,
	roblox_middleware.getModelObject,
	roblox_middleware.mutateToTexture,
	roblox_middleware.getAssetUrl,

	async (req,res)=>{
		res.status(302)
			.json({
				id_type: req.old_type,
				url: req.location_url
			})
	}
)

router.get(
	'/toImage/:id(\\d+)/redirect', 
	(req,_,next)=>{req.id = req.params.id,next()},
	roblox_middleware.getIdInformation,
	roblox_middleware.isValidForImageRequest,
	roblox_middleware.getAssetUrl,
	roblox_middleware.sendImageUrlToRouter,
	roblox_middleware.getModelObject,
	roblox_middleware.mutateToTexture,
	roblox_middleware.getAssetUrl,

	async (req,res)=>
		res.redirect(req.location_url)
)

router.get(
	'/toImage/:id(\\d+)/view', 
	(req,_,next)=>{req.id = req.params.id;next()},
	roblox_middleware.getIdInformation,
	roblox_middleware.isValidForImageRequest,
	roblox_middleware.getAssetUrl,
	roblox_middleware.sendImageUrlToRouter,
	roblox_middleware.getModelObject,
	roblox_middleware.mutateToTexture,
	roblox_middleware.getAssetUrl,

	async (req,res)=>
		res.render('simple_img',{
			img_src: req.location_url
		})
)

module.exports = router