const mongoose = require('mongoose')

const recipeSchema = mongoose.Schema({
	title: String,
	ingredients: Array,
	procedure: String,
	tags: Array,
	rating: Number,
	ratingCount: Number,
	preparationTime: Number,
	cookTime: Number,
	totalTime: Number,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User' //Type is ObjectId that references note-style documents (ref name doesn't matter)
	},
	reviews: Array
})

recipeSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		// the passwordHash should not be revealed
	}
})

module.exports = mongoose.model('Recipe', recipeSchema)