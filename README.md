# Chl's Public Web Apis

Very cool webservice with multiple apis for you to pick. See `/application/routes` and `/application/middleware`.

# Web Hosting Services Templates
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/b5Ev3e?referralCode=Qe9uPK)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

---

# Endpoints (url `/public_api`)
## Roblox (`/roblox`)
### to_image (`/to_image/[uint]`)
|Suffix|Description|
|-|-|
|`/`|Returns a JSON object, containing integer `id_type`, based from [`AssetTypeId`](https://create.roblox.com/docs/reference/engine/enums/AssetType), and `location_url`, a string where the image is located.
|`/view`|Renders a webpage of the image.|
|`/redirect`|Redirects user to `location_url`|
---

# Middleware (file directory `application/middleware`)
Mind that in order to use these, `req` (Express's Request object) must be mutated based on the indexes. If `req` is mutated appropriately, then the middleware will also mutate `req` in response
## Roblox (`/roblox`)
### getIdInformation (Async)
#### Input:
|Index|Type|Description
|-|-|-|
|`id`|`number`|Roblox id to get information from.
#### Output:
|Index|Type|Description
|-|-|-|
|`id_information`|`Object<string,any>`|Information based from `https://economy.roblox.com/v2/assets/[uint]/details`

### isValidForImageRequest
Middleware responsible for checking `req.id`.
#### Input:
|Index|Type|Description
|-|-|-|
|`id_information`|`Object<string,any>`|Information based from `https://economy.roblox.com/v2/assets/[uint]/details`
#### Output:
|Index|Type|Description
|-|-|-|
|`old_type`|`number`|AssetTypeId of `req.id`

### getAssetUrl (Async)
Retrieves the source url of the asset.
#### Input:
|Index|Type|Description
|-|-|-|
|`id`|`number`|Asset Id
#### Output:
|Index|Type|Description
|-|-|-|
|`location_url`|`string`|Source Url

### sendImageUrlToRouter
Precondition to send `req.location_url` directly to router.
#### Input:
|Index|Type|Description
|-|-|-|
|`id`|`number`|Asset Id

### getModelObject (Async)
Fetches source url into a model object. See [`CHL-a/rbxm_compiler_0`](https://github.com/CHL-a/rbxm_compiler_0) for details of this specific object. It will be subjected to errors if the buffer does not have the correct signature or if files of `.rbxm` is unimplemented
#### Input:
|Index|Type|Description
|-|-|-|
|`location_url`|`string`|Source Url
#### Output:
|Index|Type|Description
|-|-|-|
|`model_object`|`rbxm_compiler.complex_data_Types.instance`|Model object.

### mutateToTexture
Goes through the model object, finding the appropriate asset id to get the image url.
#### Input:
|Index|Type|Description
|-|-|-|
|`model_object`|`rbxm_compiler.complex_data_Types.instance`|Model object.
#### Output:
|Index|Type|Description
|-|-|-|
|`id`|`number`|New id.
