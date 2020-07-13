const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
	const body = request.body

	const user = await User.findOne({ username: body.username })   //checks if username exists
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

	response
		.status(200)
		.send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter	