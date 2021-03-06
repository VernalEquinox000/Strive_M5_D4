const express = require("express") //1 3rd party module
const fs = require("fs") //7 nodejs.org documentation, core module
const path = require("path") //8 other req core module
const uniqid = require("uniqid") //24 npm install uniqid first!
const {join} = require("path")
const { readDB, writeDB } = require("../../lib/utilities")
const multer = require("multer")
const { writeFile } = require("fs-extra")


const router = express.Router() //2

const {check, validationResult} = require("express-validator")

const readFile = fileName => {
    const fileAsBuffer = fs.readFileSync(path.join(__dirname, fileName));
    const fileAsString = fileAsBuffer.toString()
    return JSON.parse(fileAsString)
}

const studentsFilePath = path.join(__dirname, "students.json")

const uploadMiddleware = multer({})
const studentsPublicFolderPath = join(__dirname, "../../../public/img/students")

//1.router.get("/")
    router.get("/", (req, res, next) => {
        try {
            const students = readFile("students.json")
            if (req.query && req.query.surname) {
                const filteredStudents = students.filter(
                    student => student.hasOwnProperty("surname")
                        && student.surname.toLowerCase() === req.query.surname.toLowerCase())
                    
                res.send(filteredStudents)
                
            }

            else {
                res.send(students)
            }
        
        } catch (error) {
            next(error)
            
        }
    })


//POST /students/id/uploadPhoto => uploads a picture (save as idOfTheStudent.jpg in the public/img/students folder) 
//for the student specified by the id.Add a field on the students model called image, in where you store the newly created URL(http://localhost:3000/img/students/idOfTheStudent.jpg)
router.post(
    "/:id/uploadPhoto",
    uploadMiddleware.single("studentpic"),
    async (req, res, next) => {
    
        try {
        const studentsDB = await readDB(studentsFilePath)
        const idFromRequest = req.params.id
        console.log("--->", idFromRequest)
            const student = studentsDB.find(student => student.ID === idFromRequest) 
            //const newProjects = projectsDB.filter(project => project.ID !== idFromRequest)

        console.log(req.file)
        await writeFile(
        join(studentsPublicFolderPath, `${idFromRequest}.jpg`),
        req.file.buffer
        )
        
        student.image=`http://localhost:${process.env.PORT}/img/students/${idFromRequest}.jpg`
        await writeDB(studentsFilePath, studentsDB)
        res.send({ image: student.image})
    } catch (error) {
        console.log(error)
        next(error)
    }
})


    router.get("/:id/projects", (req, res, next) => { //4
/* console.log(req) */ //6
    //BELOW: lines copied from 1.router.get
    const studentsFilePath = path.join(__dirname, "students.json")//11
    const projectsFilePath = path.join(__dirname, "../projects/projects.json")
    const fileAsBuffer = fs.readFileSync(studentsFilePath); //12
    const fileAsString = fileAsBuffer.toString() //13bis
    const studentsArray = JSON.parse(fileAsString)//17

    const fileAsBuffer2 = fs.readFileSync(projectsFilePath); //12
    const fileAsString2 = fileAsBuffer2.toString() //13bis
    const projectsArray = JSON.parse(fileAsString2)//17


    const idFromRequest = req.params.id //19
    console.log("--->", idFromRequest) //20 //in postman, add id to the address
    //const student = studentsArray.filter(student => student.ID === idFromRequest)//18
    const student = studentsArray.find(student => student.ID === idFromRequest)
    console.log("student", student) //19
    const projectOfStudent = projectsArray.filter(project => project.studentID === student.ID)
    console.log(projectOfStudent)
    //if (projectOfStudent.length>0)
    res.send({...student, projects:projectOfStudent}) //5 
})


//2.router.get("/:id")
router.get("/:id", (req, res, next) => { 
    try {
        const students = readFile("students.json")
        const selectedStudent = students.filter(
            student => student.ID === req.params.id)
        if (students.length > 0) {

            res.send(selectedStudent)
        } else {
            const err = new Error()
            err.httpStatusCode = 404
            next (err)
        }
    } catch (error) {
        next (error)
    }
})

router.post("/",
    [check("surname").exists().withMessage("Surname is a mandatory field")], (req, res, next) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty())
        {
            const err = new Error()
            err.message = errors
            err.httpStatusCode = 400
            next(err)

        }
        else {const students = readFile("students.json")
        const newStudent = {
            ...req.body,
            ID: uniqid(),
            //modifiedAt: new Date(),
        }
            console.log(newStudent.ID)
        console.log(newStudent)

        students.push(newStudent)
        fs.writeFileSync(path.join(__dirname, "students.json"), JSON.stringify(students))
        res.status(201).send({ id: newStudent.ID })
        
        
        }

        
        
    }
    catch (error) {
        next(error)

    }
 })

//4.router.put("/:id")
router.put("/:id", (req, res, next) => {
    try {
        const students = readFile("students.json")
        const newStudents = students.filter(student => student.ID !== req.params.id)

        const modifiedStudent = {
            ...req.body,
            ID: req.params.id,
            //modifiedAt: new Date(),
        }

        newStudents.push(modifiedStudent)
        fs.writeFileSync(path.join(__dirname, "students.json"), JSON.stringify(newStudents))
        res.send({ modifiedStudent })
    }
    catch (error) {
        console.log(error)
        next(error)
    }
    })


//5.router.delete("/:id")
router.delete("/:id", (req, res, next) => {
    try {
        const students = readFile("students.json")
        const newStudents = students.filter(student => student.ID !== req.params.id)

        fs.writeFileSync(path.join(__dirname, "students.json"), JSON.stringify(newStudents))
        res.status(204).send()
    }
    catch (error) {
        console.log(error)
        next(error)
    }
 })









module.exports = router
