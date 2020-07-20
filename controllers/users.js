const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('createdRecipes', { 
		ingredients: 1, 
		tags: 1, 
		reviews: 1,  
		title: 1, 
		procedure: 1, 
		preparationTime: 1,  
		cookTime: 1,  
		totalTime: 1, 
		rating: 1, 
	}).populate('favoritedRecipes', { 
		ingredients: 1, 
		tags: 1, 
		reviews: 1,  
		title: 1, 
		procedure: 1, 
		preparationTime: 1,  
		cookTime: 1,  
		totalTime: 1, 
		rating: 1, 
		author: 1
	}).populate('queuedRecipes', {
		ingredients: 1, 
		tags: 1, 
		reviews: 1,  
		title: 1, 
		procedure: 1, 
		preparationTime: 1,  
		cookTime: 1,  
		totalTime: 1, 
		rating: 1, 
		author: 1
	})
	response.json(users.map(u => u.toJSON())) 
})

usersRouter.post('/', async (request, response) => {
	const body = request.body

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(body.password, saltRounds)
	//tags, averageRating, favoritedRecipes, queuedRecipes values set to default (user entries ignored)
	const user = new User({
		username: body.username,
		firstName: body.firstName,
		lastName: body.lastName,
		email: body.email,
		passwordHash,
		averageRating: null,
		followerCount: 0
	})


	const savedUser = await user.save()

	response.json(savedUser)
})

usersRouter.put('/:id', async (request, response) => {
	
	const body = request.body
	const saltRounds = 10
	let changedUserInfo = {} //Will contain key-value pairs based on data available in body
	
	//Updating password if body contains password
	if (Object.prototype.hasOwnProperty.call(body, "password"))
	{
		const passwordHash = await bcrypt.hash(body.password, saltRounds)
		changedUserInfo.passwordHash = passwordHash
	}
	if (Object.prototype.hasOwnProperty.call(body, "firstName"))
	{
		changedUserInfo.firstName = body.firstName
	}
	if (Object.prototype.hasOwnProperty.call(body, "lastName"))
	{
		changedUserInfo.lastName = body.lastName
	}
	if (Object.prototype.hasOwnProperty.call(body, "email"))
	{
		changedUserInfo.email = body.email
	}
	if (Object.prototype.hasOwnProperty.call(body, "averageRating"))
	{
		changedUserInfo.averageRating = body.averageRating
	}
	if (Object.prototype.hasOwnProperty.call(body, "favoritedRecipes"))
	{
		changedUserInfo.favoritedRecipes = body.favoritedRecipes
	}
	if (Object.prototype.hasOwnProperty.call(body, "queuedRecipes"))
	{
		changedUserInfo.queuedRecipes = body.queuedRecipes
	}
	if (Object.prototype.hasOwnProperty.call(body, "followedUsers"))
	{
		changedUserInfo.followedUsers = body.followedUsers
	}
	if (Object.prototype.hasOwnProperty.call(body, "followerCount"))
	{
		changedUserInfo.followerCount = body.followerCount
	}

	const updatedUser = await User.findByIdAndUpdate(request.params.id, changedUserInfo)
	response.json(updatedUser)
})

module.exports = usersRouter