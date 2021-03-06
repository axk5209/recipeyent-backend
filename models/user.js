const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
	username: {type: String, unique: true},
	firstName: String,
	lastName: String,
	passwordHash: String,
	email: String,
	followerCount: Number,
	createdRecipes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}],
	favoritedRecipes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}],
	queuedRecipes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}],
	followedUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	reviewsGiven: mongoose.Mixed,
	ratingsGiven: mongoose.Mixed,
	tagsGiven: mongoose.Mixed,
	pictureId: String

})

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		// the passwordHash should not be revealed
		delete returnedObject.passwordHash
	}
})
userSchema.plugin(uniqueValidator)
const User = mongoose.model('User', userSchema)

module.exports = User