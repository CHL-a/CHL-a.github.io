const express = require('express')
const router = express.Router()
const roblox_middleware = 
	require('../../middleware/roblox')

router.use(
	'/to_image/:id(\\d+)', 
	(req,_,next)=>{req.id = req.params.id,next()},
	roblox_middleware.getIdInformation,
	roblox_middleware.isValidForImageRequest,
	roblox_middleware.getAssetUrl,
	roblox_middleware.sendImageUrlToRouter,
	roblox_middleware.getModelObject,
	roblox_middleware.mutateToTexture,
	roblox_middleware.getAssetUrl,
	require('./to_image')
)

module.exports = router