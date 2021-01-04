const express = require("express") 
const fs = require("fs")
const { userInfo } = require("os")
const path = require("path")
const {join} = require("path")
const uniqid = require("uniqid")
const { readDB, writeDB } = require("../../lib/utilities")
const multer = require("multer")
const { writeFile } = require("fs-extra")


const {check, validationResult} = require("express-validator")

const router = express.Router() 

const projectsFilePath = path.join(__dirname, "projects.json")
const reviewsFilePath = path.join(__dirname, "../reviews/reviews.json")

const uploadMiddleware = multer({})
const projectsPublicFolderPath = join(__dirname, "../../../public/img/projects")


//GET
router.get("/", async (req, res, next) => { //2
    try {
        const projectsDB = await readDB(projectsFilePath)
        console.log(req.query) 
        console.log(req.query.name)
        if (req.query && req.query.name) {
            const filteredProjects = projectsDB.filter(
                project => project.hasOwnProperty("name")
                    && project.name.toLowerCase() === req.query.name.toLowerCase())
            res.send(filteredProjects)
        }
        else {
            res.send(projectsDB)
        }
    } catch (error) {
        next (error)
    }
})

//GET /projects/id/reviews => get all the reviews for a given project
router.get("/:id/reviews", async (req, res, next) => {
    try {
        const projectDB = await readDB(projectsFilePath)
        const reviewsDB = await readDB(reviewsFilePath)
        console.log(reviewsDB)
        const idFromRequest = req.params.id
        console.log("--->", idFromRequest)
        const project = projectDB.find(project => project.ID = idFromRequest)
        console.log("project", project)
        const reviewsOfProject = reviewsDB.filter(review => review.projectID === project.ID)
        console.log(reviewsOfProject)
        res.send({ ...project, reviews: reviewsOfProject })

    } catch (error) {
        console.log(error)
        next(error)
    }
})

//GET :id
router.get("/:id", async (req, res, next) => {
    try {
        const projectsDB = await readDB(projectsFilePath)
        const selectedProject = projects.filter(
            project => project.ID === req.params.id)
        if (projectsDB.length > 0) {

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


//POST /projects/id/uploadPhoto => uploads a picture (save as idOfTheProject.jpg in the public/img/projects folder) 
//for the project specified by the id.Add a field on the project model called image, in where you store the newly created URL(http://localhost:3000/img/projects/idOfTheProject.jpg)


router.post(
    "/:id/uploadPhoto",
    uploadMiddleware.single("projectpic"),
    async (req, res, next) => {
    
        try {
        const projectsDB = await readDB(projectsFilePath)
        const idFromRequest = req.params.id
        console.log("--->", idFromRequest)
            const project = projectsDB.find(project => project.ID === idFromRequest) 
            //const newProjects = projectsDB.filter(project => project.ID !== idFromRequest)

        console.log(req.file)
        await writeFile(
        join(projectsPublicFolderPath, `${idFromRequest}.jpg`),
        req.file.buffer
        )
        project.image=`http://localhost:${process.env.PORT}/img/projects/${idFromRequest}.jpg`
        await writeDB(projectsFilePath, projectsDB)
        res.send({ image: project.image})
    
            


        
        //res.send(`Uploaded ${req.file.size}bytes`)
    } catch (error) {
        console.log(error)
        next(error)

    }
}
 )





 
//POST / projects / id / reviews => add a new review for the given project
router.post("/:id/reviews", [check("name").exists().withMessage("Name is a mandatory field")], async(req, res, next) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty())
        {
            const err = new Error()
            err.message = errors
            err.httpStatusCode = 400
            next(err)
        }
        else {
            const projectDB = await readDB(projectsFilePath)
        const reviewsDB = await readDB(reviewsFilePath)
        console.log(reviewsDB)
        const idFromRequest = req.params.id
        console.log("--->", idFromRequest)
        const project = projectDB.find(project => project.ID = idFromRequest)
        console.log("project", project)
        const reviewsOfProject = reviewsDB.filter(review => review.projectID === project.ID)
        console.log(reviewsOfProject)
        //res.send({ ...project, reviews: reviewsOfProject })
            
        const newReview = {
            ...req.body,
            ID:uniqid(),
            date: new Date(),
        }
        console.log(newReview)

        reviewsDB.push(newReview)
        await writeDB(reviewsFilePath, reviewsDB)
        res.status(201).send(newReview)
        }        
    }
    catch (error) {
        next(error)
    }
 })

// POST :id
router.post("/", [check("name").exists().withMessage("Name is a mandatory field")], async(req, res, next) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty())
        {
            const err = new Error()
            err.message = errors
            err.httpStatusCode = 400
            next(err)
        }
        else {
            const projectsDB = await readDB(projectsFilePath)
            const newProject = {
            ...req.body,
            ID: uniqid(),
            modifiedAt: new Date(),
        }
            console.log(newProject.ID)
        console.log(newProject)

        projectsDB.push(newProject)
        await writeDB(projectsFilePath, projectsDB)
        res.status(201).send({ id: newProject.ID })
        }        
    }
    catch (error) {
        next(error)
    }
 })

 //PUT projects/:id/reviews/:reviewId
router.put("/:id/reviews/:revid", async (req, res, next) => {
    try {
        const projectDB = await readDB(projectsFilePath)
        const reviewsDB = await readDB(reviewsFilePath)
        const idFromRequest = req.params.id
        const project = projectDB.find(project => project.ID === idFromRequest)
        const reviewsOfProject = reviewsDB.filter(review => review.projectID === project.ID)
        console.log(reviewsOfProject)
        const revIdFromRequest = req.params.revid 
        console.log("--->", revIdFromRequest)
        const review = reviewsDB.find(review => review.ID === revIdFromRequest)
        console.log("review", review)

        const newReviewsDB = reviewsDB.filter(review => review.ID !== req.params.revid)

        const modifiedReview = {
            ...req.body,
            ID: req.params.revid,
            modifiedAt: new Date(),
        }

        newReviewsDB.push(modifiedReview)
        await writeDB(reviewsFilePath, newReviewsDB)
        res.send({ id: modifiedReview.ID })
    }
    catch (error) {
        console.log(error)
        next(error)
    }
})
    
 //PUT project/:id
router.put("/:id", async (req, res, next) => {
    try {
        const projectsDB = await readDB(projectsFilePath)
        const newProjects = projectsDB.filter(project => project.ID !== req.params.id)

        const modifiedProject = {
            ...req.body,
            ID: req.params.id,
            modifiedAt: new Date(),
        }

        newProjects.push(modifiedProject)
        await writeDB(projectsFilePath, newProjects)
        res.send({ id: modifiedProject.ID })
    }
    catch (error) {
        console.log(error)
        next(error)
    }
    })

//PUT projects/:id/reviews/:reviewId
router.delete("/:id/reviews/:revid", async(req, res, next) => {
    try {
        //const projectsDB = await readDB(projectsFilePath)
        //const newProjects = projects.filter(project => project.ID !== req.params.id)

        const reviewsDB = await readDB(reviewsFilePath)
        const revIdFromRequest = req.params.revid 
        console.log("--->", revIdFromRequest)
        const newReviewsDB = reviewsDB.filter(review => review.ID !== req.params.revid)

        await writeDB(reviewsFilePath, newReviewsDB)
        res.status(204).send()
    }
    catch (error) {
        console.log(error)
        next(error)
    }
})
 

//DELETE
router.delete("/:id", async(req, res, next) => {
    try {
        const projectsDB = await readDB(projectsFilePath)
        const newProjects = projects.filter(project => project.ID !== req.params.id)

        await writeDB(projectsFilePath, newProjects)
        res.status(204).send()
    }
    catch (error) {
        console.log(error)
        next(error)
    }
 })



//[EXTRA] Edit & Delete




module.exports = router 