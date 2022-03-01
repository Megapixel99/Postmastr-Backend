const multer = require('multer');
const { tesseract, } = require('../../../util');
const sharp = require('sharp');
const path = require('path');
const app = require('express').Router();
const auth = require("../../../middleware/auth");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("setting dest");
        cb(null, path.resolve(`${__dirname}/../../../images`))
    },
});
const upload = multer({ storage: storage });

app.post('*',/* auth, */upload.single('image'), async (req, res) => {

    //begin reg struct
    console.log(req.file.path);
    let img = req.file.path;
    const metadata = await sharp(img).metadata();
    console.log("Acquire Original Dimensions");
    const origWidth = metadata.width;
    const origHeight = metadata.height;
    console.log("Original dimensions acquired");
    if ((origWidth < 1000) && (origHeight < 1000)) {
        console.log("begin resizing");
        const resizedImage =
            await sharp(img).resize(1000, 1000, {
                fit: 'contain'
            }).toFile(`${img}-processed`)
        console.log("resizing successful");
        console.log(resizedImage);
        img = `${img}-processed`;
    }
    const labelData = (await tesseract(img));


    return res.status(200).json({
        result: {
            finalData: labelData
        },
        message: "Processing Complete",
    });
});
module.exports = app;