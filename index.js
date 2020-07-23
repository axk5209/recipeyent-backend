const app = require('./app') // the actual Express application
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')
// const socketIo = require("socket.io")
const server = http.createServer(app)
// const io = socketIo(server)

// io.on("connection", socket => {
// 	//  console.log("New client connected" + socket.id);
// 	//console.log(socket);
// 	// Returning the initial data of food menu from FoodItems collection
// 	socket.emit("Connection", "Connection established")
	

// })
server.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`)
})