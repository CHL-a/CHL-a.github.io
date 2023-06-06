/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("express").NextFunction} NextFunction
 */


module.exports = {
	/**
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {NextFunction} next 
	 */
	getIdResponse: async (req,res,next)=>{
		var destination_url = `https://roblox.com/library/${req.params.id}`
		var response = await fetch(destination_url)
		
		while (response.redirected)
			response = await fetch(destination_url = response.url)

		if (response.status >= 400)
			return res.status(400)
				.json({
					message:`Bad id: got ${req.params.id}`
				})

		req.id = req.params.id;
		req.destination_url = destination_url
		req.destination_response = response
		next()
	},

	/**
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {NextFunction} next 
	 */
	getIdInformation: async (req,_,next) => {
		req.id_information = await (await fetch(`https://economy.roblox.com/v2/assets/${req.id}/details`)).json()
		next()
	},

	isValidForImageRequest: (req,res,next)=>{
		const typeId = req.id_information.AssetTypeId

		/**
		 * image  1
		 * tshirt 2
		 * decal  13
		 * shirt  11
		 * pants  12
		 * face   18
		 */
		if(!(
			typeId == 1 ||
			typeId == 2 || 
			typeId == 13 || 
			typeId == 11 ||
			typeId == 12 || 
			typeId == 18
			))
			return res.status(400)
				.json({
					message:`Got bad asset id type: ${typeId}`
				})

		req.old_type = typeId

		next()
	},

	/**
	 * @param {Request} req
	 */
	getFileLocation: async (req,res,next)=>{
		var response = await fetch(
			`https://assetdelivery.roblox.com/v2/assetId/${req.params.id}`
		)

		const json_object = await response.json()

		// ! needs a check because locations has an array for a specific reason

		response = await fetch(json_object.locations[0].location)

		req.destination_response = response

		next()
	}
}