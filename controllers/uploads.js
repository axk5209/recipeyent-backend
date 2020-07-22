const uploadsRouter = require('express').Router()
const { cloudinary } = require('../utils/cloudinary')
const logger = require('../utils/logger')

//Reset everything


uploadsRouter.post('/', async (req, res) => {
	try {
		const fileStr = req.body.file
		const uploadResponse = await cloudinary.uploader.upload(fileStr, {
			upload_preset: 'dev_testing',
		})
		res.json({pictureId: uploadResponse.public_id})
	} catch (err) {
		logger.error(err)
		res.status(400).json({ err: 'Something went wrong' })
	}
})


module.exports = uploadsRouter
