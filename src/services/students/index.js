const express = require("express") //1 3rd party module
const fs = require("fs") //7 nodejs.org documentation, core module
const path = require("path") //8 other req core module
const uniqid =require("uniqid") //24 npm install uniqid first!
const router = express.Router() //2

//1.router.get("/")
router.get("/", (req, res) => { //4
    //handler
    /* console.log(__dirname) */ //tell current folder //9
    //send something from postman to see this
/* console.log(path.join(__dirname, "students.json"))  *///10
    const studentsFilePath = path.join(__dirname, "students.json")//11
    const fileAsBuffer = fs.readFileSync(studentsFilePath); //12
    //returns a buffer (machine readable, not human)
    /* console.log(fileAsBuffer.toString()) */ //13
    const fileAsString=fileAsBuffer.toString() //13bis
    //let's convert buffer into something readable

    //a) retrive list from a file on disk, because no db yet
    //b) i want to send list as a response but in JSON
    /* console.log(JSON.parse(fileAsBuffer.toString())) */ //15
    const fileAsJSObject = JSON.parse(fileAsString) //15 bis
    /* console.log(req) */ //6 
/* res.send("list of users route") */ //5
    /* res.send(fileAsBuffer.toString()) */ //14
/* res.send(JSON.parse(fileAsBuffer.toString())) */ //16
    res.send(fileAsJSObject) //16bis
})

///////////////////////////
/* router.get("/testError", (req, res, next) => {
    try {
        throw new Error ("test error")
        
    }
    catch (error) {
        next(error)
    }
} ) */
/////////////////////////////

//2.router.get("/:id")
router.get("/:identifier", (req, res) => { //4
/* console.log(req) */ //6
    //BELOW: lines copied from 1.router.get
    const studentsFilePath = path.join(__dirname, "students.json")//11
    const fileAsBuffer = fs.readFileSync(studentsFilePath); //12
    const fileAsString = fileAsBuffer.toString() //13bis
    const studentsArray = JSON.parse(fileAsString)//17
    const idFromRequest = req.params.identifier //19
    console.log("--->", idFromRequest) //20 //in postman, add id to the address
    const student = studentsArray.filter(student => student.ID === idFromRequest)//18
    console.log("student", student) //19
    res.send("single user route") //5 
})

//3.router.post("/")
router.post("/", (req, res) => { //4
/* console.log(req) */ //6
    //BELOW: lines copied from 2.router.get
    //(1) read the old content from file
    const studentsFilePath = path.join(__dirname, "students.json")//11
    const fileAsBuffer = fs.readFileSync(studentsFilePath); //12
    const fileAsString = fileAsBuffer.toString() //13bis
    const studentsArray = JSON.parse(fileAsString)//17

    //(2) push new to studentsArray

    //(2.1) let's create an id

    const newStudent = req.body //20
    newStudent.ID = uniqid() //25 (n.b. 24 is importing uniquid)
    console.log(newStudent) //21
    //in postman: body>raw>JSON
    studentsArray.push(newStudent) //22
    console.log(studentsArray) //23

    //(3) replace old content

    fs.writeFileSync(studentsFilePath, JSON.stringify(studentsArray)) //26

/* res.send("create users route") //5 */
    res.status(201).send(newStudent.ID) //27
})

//4.router.put("/:id")
router.put("/:id", (req, res) => { //4
/* console.log(req) */ //6
    //BELOW line copied from 3.POST
    //1.read file
        const studentsFilePath = path.join(__dirname, "students.json")//11
    const fileAsBuffer = fs.readFileSync(studentsFilePath); //12
    const fileAsString = fileAsBuffer.toString() //13bis
    const studentsArray = JSON.parse(fileAsString)//17

    //2. filter
    const newStudentsArray = studentsArray.filter(student => student.ID !== req.params.id)//31
    // ===28

    //3. add new file
    const modifiedStudent = req.body //29
    modifiedStudent.ID = req.params.id //30
    
    newStudentsArray.push(modifiedStudent) //31

    //4. write back on disk
        fs.writeFileSync(studentsFilePath, JSON.stringify(newStudentsArray)) //29



    res.send("put users route") //5
})

//5.router.delete("/:id")
router.delete("/:id", (req, res) => { //4 //name can be :whatever
/* console.log(req) */ //6
    //BELOW:lines copied form 3. POST
    //1. read the file
    const studentsFilePath = path.join(__dirname, "students.json")//11
    const fileAsBuffer = fs.readFileSync(studentsFilePath); //12
    const fileAsString = fileAsBuffer.toString() //13bis
    const studentsArray = JSON.parse(fileAsString)//17

    //2. filter out the user with specific id
    const newStudentsArray = studentsArray.filter(student => student.ID !== req.params.id)//28
    //taken from 18 but with !== instead than === and req.params.id

    //3. save it back from disk
    fs.writeFileSync(studentsFilePath, JSON.stringify(newStudentsArray)) //29
    //taken from 26
/* res.send("delete users route") */ //5
    res.status(204),send() //30
})


router.get("/:identifier/projects", (req, res) => { //4
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


    const idFromRequest = req.params.identifier //19
    console.log("--->", idFromRequest) //20 //in postman, add id to the address
    //const student = studentsArray.filter(student => student.ID === idFromRequest)//18
    const student = studentsArray.find(student => student.ID === idFromRequest)
    console.log("student", student) //19
    const projectOfStudent = projectsArray.filter(project => project.studentID === student.ID)
    console.log(projectOfStudent)
    //if (projectOfStudent.length>0)
    res.send({...student, projects:projectOfStudent}) //5 
})





module.exports = router //3

