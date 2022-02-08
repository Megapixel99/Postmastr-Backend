const app = require('express').Router();
const connectDB = require("../../../util/db.js");
const multer = require('multer')
import Tesseract from 'tesseract.js';
const upload = multer({

    limits: {
        fileSize: 10000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            cb(new Error('please upload an image'))

        }
        cb(undefined, true)
    },
    image: {
        type: Buffer
    }
})
app.post("*", upload.single('upload'), async (req, res) => {
    try {
        const incident = await incident.findById(req.body.id)
        incident.image = req.file.buffer
        incident.save()
        res.send()

    }
    catch (e) {
        res.status(400).send(e)

    }
    (error, req, res, next) => {
        res.status(400).send({ error: error.message })
    }


})


module.exports = app;
