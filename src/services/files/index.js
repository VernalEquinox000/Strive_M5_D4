const express = require("express")
const multer = require("multer")
const { writeFile } = require("fs-extra")
const { join } = require("path")

const router = express.Router()


const uploadMiddleware = multer({})

const studentsPublicFolderPath = join(__dirname, "../../../public/img/students")

router.post(
    "/upload",
    uploadMiddleware.single("cazzo"),
    async (req, res, next) => {
    
        try {
        console.log(req.file)
        await writeFile(
            join(studentsPublicFolderPath, req.file.originalname),
            req.file.buffer
        )
        res.send(`Uploaded ${req.file.size}bytes`)
    } catch (error) {
        console.log(error)
        next(error)

    }
}
 )

module.exports = router