const express = require("express") 
const fs = require("fs")
const { userInfo } = require("os")
const path = require("path")
const uniqid = require("uniqid")

const {check, validationResult} = require("express-validator")

const router = express.Router() 

//[EXTRA] GET /students/:studentsId/projects/ => get all the projects for a student with a given ID

////NEW to read File // from M5-D3 //1
const readFile = fileName => {
    //const projectsFilePath = path.join(__dirname, "projects.json")//11
    const fileAsBuffer = fs.readFileSync(path.join(__dirname, fileName)); //12
    const fileAsString = fileAsBuffer.toString() //13bis
    //const fileAsJSObject = 
    return JSON.parse(fileAsString)
} 

////new

router.get("/", (req, res, next) => { //2
    try {
        const projects = readFile("projects.json")
        console.log(req.query) //4 print query in postman 
        console.log(req.query.name)
        if (req.query && req.query.name) {
            const filteredProjects = projects.filter(
                project => project.hasOwnProperty("name")
                    && project.name.toLowerCase() === req.query.name.toLowerCase())
        
            res.send(filteredProjects)

        }

        else {
            res.send(projects)
        }
    } catch (error) {
        next (error)
    }
     //3
    
})


router.get("/:id", (req, res, next) => {
    try {
        const projects = readFile("projects.json")
        const selectedProject = projects.filter(
            project => project.ID === req.params.id)
        if (projects.length > 0) {

            res.send(selectedProject)
        } else {
            const err = new Error()
            err.httpStatusCode = 404
            next (err)
        }
    } catch (error) {
        next (error)
    }
    
 })

router.post("/", [check("name").exists().withMessage("Name is a mandatory field")], (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty())
        {
            const err = new Error()
            err.message = errors
            err.httpStatusCode = 400
            next(err)

        }
        else {const projects = readFile("projects.json")
        const newProject = {
            ...req.body,
            ID: uniqid(),
            modifiedAt: new Date(),
        }
            console.log(newProject.ID)
        console.log(newProject)

        projects.push(newProject)
        fs.writeFileSync(path.join(__dirname, "projects.json"), JSON.stringify(projects))
        res.status(201).send({ id: newProject.ID })
        
        
        }

        
        
    }
    catch (error) {
        next(error)

    }
 })

router.put("/:id", (req, res) => {
    try {
        const projects = readFile("projects.json")
        const newProjects = projects.filter(project => project.ID !== req.params.id)

        const modifiedProject = {
            ...req.body,
            ID: req.params.id,
            modifiedAt: new Date(),
        }

        newProjects.push(modifiedProject)
        fs.writeFileSync(path.join(__dirname, "projects.json"), JSON.stringify(newProjects))
        res.send({ modifiedProject })
    }
    catch (error) {
        console.log(error)
        next(error)
    }
    })


router.delete("/:id", (req, res) => {
    try {
        const projects = readFile("projects.json")
        const newProjects = projects.filter(project => project.ID !== req.params.id)

        fs.writeFileSync(path.join(__dirname, "projects.json"), JSON.stringify(newProjects))
        res.status(204).send()
    }
    catch (error) {
        console.log(error)
        next(error)
    }
 })





module.exports = router //3