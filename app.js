const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const path = require('path')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const recipesRouter = require("./controllers/recipes")
const uploadsRouter = require("./controllers/uploads")
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
	const resetRouter = require('./controllers/reset')
	app.use('/api/reset', resetRouter)
}
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)
logger.info(config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		logger.info('connected to MongoDB')
	})
	.catch((error) => {
		logger.error('error connection to MongoDB:', error.message)
	})

app.use(cors())
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '/build')))
app.use(express.json({ limit: '50mb' }))
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/recipes', recipesRouter)
app.use('/api/uploads', uploadsRouter)


// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/build/index.html'))
})
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app
