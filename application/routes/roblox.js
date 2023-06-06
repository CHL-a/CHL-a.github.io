const express = require('express')
const router = express.Router()
const roblox_middleware = require('../middleware/roblox')

// face, decal, image to image id
router.get(
	'/toImage/:id(\\d+)', 
	roblox_middleware.getIdResponse,
	roblox_middleware.getIdInformation,
	roblox_middleware.isValidForImageRequest,
	roblox_middleware.getFileLocation,
	async (req,res)=>{
		var old_type = req.old_type
		const result = {
			old_id: req.id,
			old_type: old_type
		}

		if (old_type == 1)
			result.new_id = result.old_id
		else{
			var response = await fetch(
				`https://assetdelivery.roblox.com/v2/assetId/${result.old_id}`
			)

			const json_object = await response.json()

			// ! needs a check because locations has an array for a specific reason
			


			response = await fetch(json_object.locations[0].location)
			
			
			
		}

		/*
		else
			return res.status(400)
				.json({message:`Unimplemented id:${old_type}`})

				*/
		

		res.status(200).json(result)
})


module.exports = router