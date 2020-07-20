const recipesRouter = require('express').Router()
const Recipe = require('../models/recipe')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


recipesRouter.get('/', async (request, response) => {
	const recipes = await Recipe.find({}).populate('author', { firstName: 1, lastName: 1 })
	response.json(recipes.map(b => b.toJSON()))

})


recipesRouter.post('/', async (request, response) => {

	const decodedToken = jwt.verify(request.token, process.env.SECRET) //Verfies that token is legit
	if (!request.token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}
	const user = await User.findById(decodedToken.id) //contains username and id fields	

	/* Required Fields: title, ingredients, procedure, preparationTime, cookTime, totalTime, author
		Optional Fields: tags
	*/
	const newRecipe = new Recipe({
		title: request.body.title,
		ingredients: request.body.ingredients,
		procedure: request.body.procedure,
		preparationTime: request.body.preparationTime,
		cookTime: request.body.cookTime,
		totalTime: request.body.totalTime,
		author: user._id,
		tags: request.body.tags ? request.body.tags : [],
		rating: null,
		ratingCount: 0
	})

	const result = await newRecipe.save()
	user.createdRecipes = user.createdRecipes.concat(newRecipe._id)  //Updates recipes, but this doesn't actually change anything
	await user.save()//user object also changes //save() automatically updates if object _id already exists ??
	response.status(201).json(result)

})



recipesRouter.delete('/:id', async (request, response) => {

	const decodedToken = jwt.verify(request.token, process.env.SECRET) //Verfies that token is legit
	if (!request.token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}
	const recipe = await Recipe.findById(request.params.id)
	if (!recipe) {
		return response.status(401).json({ error: 'recipe does not exist' })
	}

	//recipe.user is an object, must be converted for comparison 
	//Always safe to convert things to strings for comparison
	if (recipe.author.toString() !== decodedToken.id.toString()) {
		return response.status(401).json({ error: `${decodedToken.username} does not have rights to delete this recipe.` })
	}
	await Recipe.findByIdAndRemove(request.params.id)

	response.status(201).end()
})


recipesRouter.put('/:id', async (request, response) => {
	const decodedToken = jwt.verify(request.token, process.env.SECRET) //Verfies that token is legit
	if (!request.token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}
	const recipe = await Recipe.findById(request.params.id)
	if (!recipe) {
		return response.status(401).json({ error: 'recipe does not exist' })
	}
	//Can only modify tags, rating, and reviews
	let newRecipes = {}
	if (Object.prototype.hasOwnProperty.call(request.body, "tags")) {
		newRecipes.tags = request.body.tags
	}
	if (Object.prototype.hasOwnProperty.call(request.body, "rating")) {
		newRecipes.rating = request.body.rating
	}
	if (Object.prototype.hasOwnProperty.call(request.body, "reviews")) {
		newRecipes.reviews = request.body.reviews
	}
	if (Object.prototype.hasOwnProperty.call(request.body, "ratingCount")) {
		newRecipes.ratingCount = request.body.ratingCount
	}
	const updatedNote = await Recipe.findByIdAndUpdate(request.params.id, newRecipes)
	response.status(201).json(updatedNote)
})


module.exports = recipesRouter