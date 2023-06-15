/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("express").NextFunction} NextFunction
 */

const rbxm_compiler = require('rbxm_compiler_0')

module.exports = {
	/**
	 * in: req.id
	 * out: req.id_information
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {NextFunction} next 
	 */
	getIdInformation: async (req,_,next) => {
		// pre
		if (!req.id)
			return res.status(412)
				.json({
					message: 'req.id required'
				})

		// main
		req.id_information = 
			await (
				await fetch(
					`https://economy.roblox.com/v2/assets/${
						req.id
						}/details`
					)
				).json()
		next()
	},

	/**
	 * in: req.id_information
	 * out: req.old_type
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {NextFunction} next 
	 */
	isValidForImageRequest: (req,res,next)=>{
		// pre
		if (!req.id_information)
			return res.status(412)
				.json({
					message: 'req.id_information required'
				})

		// main
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
	 * in: req.id
	 * out: req.location_url
	 * 
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {NextFunction} next 
	 */
	getAssetUrl: async (req,res,next)=>{
		// pre
		if (!req.id)
			return res.status(412)
				.json({
					message: 'req.id required'
				})

		// main
		var response = await fetch(
			`https://assetdelivery.roblox.com/v2/assetId/${req.id}`
		)

		var json_object = (await response.json())
		
		if (json_object.errors)
			return res.status(412)
				.json({
					message: 'First url request failed:',
					response: json_object
				})

		// ! needs a check because locations has an array for a specific reason
		req.location_url =
			json_object
				.locations[0]
				.location

		next()
	},

	/**
	 * in: req.old_type
	 * 
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {NextFunction} next 
	 */
	sendImageUrlToRouter: (req,_,next)=>{
		if(req.old_type == 1)
			return next('router')
		next()
	},

	/**
	 * in: req.location_url
	 * req.id_information
	 * out: req.model_object
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {NextFunction} next 
	 */
	getModelObject: async (req,res,next)=>{
		// pre
		if (!req.location_url)
			return res.status(412)
				.json({
					message: 'req.location_url required'
				})
		
		// main
		var buffer_input = Buffer.from(
			await (await fetch(req.location_url))
				.arrayBuffer()
			)

		var type = rbxm_compiler.shared.is_rbxm(buffer_input)

		if (!type)
			return res.status(412)
				.json({
					message: 'File of asset is not a roblox model'
				})
		
		req.model_object = new rbxm_compiler
			[type]
			.model_file(buffer_input)
		
		next()
	},

	/**
	 * in: req.model_object
	 * req.old_type
	 * out: req.id
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {NextFunction} next 
	 */
	mutateToTexture: async(req,res,next)=>{
		// pre
		if (!req.model_object)
			return res.status(412)
				.json({
					message: 'req.model_object required'
				})

		var {old_type} = req
		
		if (!old_type)
			return res.status(412)
				.json({
					message: 'req.old_type required'
				})
		
		// main
		/** @type {import('rbxm_compiler_0').complex_data_types.abstract} */
		var target_instance = 
			req
			.model_object
			.root
			.children[0]

		if (!(
			target_instance.class_name == 'Decal' && 
				(old_type == 13 || old_type == 18)|| 
			target_instance.class_name == 'ShirtGraphic' && 
				old_type == 2 ||
			target_instance.class_name == 'Pants' && 
				old_type == 12 || 
			target_instance.class_name == 'Shirt' &&
				old_type == 13
				// ... 
			))
			return res.status(500)
				.json({
					message: 'Mismatched instance class_name with old_type'
				})

		var property = null

		switch (target_instance.class_name) {
			case 'Decal':
				property = 'Texture'
				break;
		
			case 'ShirtGraphic':
				property = 'Graphic'
				break;

			case 'Pants':
				property = 'PantsTexture'
				break
			
			case 'Shirt':
				property = 'ShirtTexture'
				break

			default:
				break;
		}

		if (!property)
			return res.status(500)
				.json({
					message: 'Missing property for target instance'
				})
	
			
		var value = /** @type {string} */( target_instance
			.properties
			[property])
			

		var regex_found = value.match(/\d+/)

		if (!regex_found)
			return res.status(412)
				.json({message: `no digits in model file value: ${value}`})
		
		console.log(req.id,regex_found)
		req.id = regex_found[0]

		next()
	}
}