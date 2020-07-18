const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
	const body = request.body

	const user = await User.findOne({ username: body.username }).populate('createdRecipes', { 
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
	})   //checks if username exists
	const passwordCorrect = user === null
		? false
		: await bcrypt.compare(body.password, user.passwordHash) //checks if password creates correct hash
 
	if (!(user && passwordCorrect)) { //informs user if invalid credentials
		return response.status(401).json({
			error: 'invalid username or password'
		})
	}

	const userForToken = {
		username: user.username,
		id: user._id,
	}

	const token = jwt.sign(userForToken, process.env.SECRET) //signs the token, and this will be used later on 
	//(this is only signed by us, which is why someone can't just make a token and go forword)
	//Also someone can't just generate the password hash because bycrypt only compares the password to the hash created
	
	const safeUserInfo = user.toJSON() //Doesn't actually convert to JSON, just changes what is sent
	response
		.status(200)
		.send({ token, ...safeUserInfo})
})

module.exports = loginRouter	