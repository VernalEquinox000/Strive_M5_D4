const express = require("express") //1
const cors = require("cors") //8
const {join} = require("path")
const listEndPoints =require("express-list-endpoints") //10
const projectsRoutes = require("./services/projects") //5
const studentsRoutes = require("./services/students")
const errorRoutes = require("./services/problematicRoutes")
const filesRoutes = require("./services/files")

const {notFoundErrorHandler,
    unauthorizedErrorHandler,
    forbiddenErrorHandler,
    badRequestErrorHandler,
    catchAllErrorHandler, } = require("./errorHandling")
    
const server = express() //2

const port = process.env.PORT || 3002 //3

const publicFolderPath = join(__dirname, "../public") //NEW


///MIDDLEWARE
const loggerMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.url} ${new Date()}`)
    next() //Mandatory to send the control to what's happening next
    //next middleware in chain or route handler
} 

const errorMiddleware = (err, req, res, next) => {

}

server.use(cors()) //9
server.use(express.json()) //7
server.use(loggerMiddleware)
server.use(express.static(publicFolderPath)) //new

// ROUTES

server.use("/projects", projectsRoutes) //6 grab
server.use("/students", studentsRoutes)
server.use("/problems", errorRoutes)
server.use("/files", filesRoutes)

// ERROR HANDLERS
server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(unauthorizedErrorHandler)
server.use(catchAllErrorHandler)

//const errorMiddleware = (err, req, res, next) => {}

//server.use(badRequestHandler)
//server.use(notFoundHandler)
//server.use(genericErrorHandler)

console.log(listEndPoints(server))


server.listen(port, () => { //4
    console.log("Server is running on port: ", port)
}) 