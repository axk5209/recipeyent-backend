const router = require('express').Router()
const User = require('../models/user')
const Recipe = require('../models/recipe')

//Reset everything
router.post('/all', async (request, response) => {
	await User.deleteMany({})
	await Recipe.deleteMany({})
	response.status(204).end()
})

//Reset users
router.post('/users', async (request, response) => {
	await User.deleteMany({})
	response.status(204).end()
})

//Reset recipes
router.post('/recipes', async (request, response) => {
	await Recipe.deleteMany({})
	response.status(204).end()
})

module.exports = router