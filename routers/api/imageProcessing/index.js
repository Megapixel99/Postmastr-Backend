const app = require('express').Router();
const multer = require('multer');
const { tesseract, } = require('../../../util');
const sharp = require('sharp');
const auth = require("../../../middleware/auth");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("setting dest");
        cb(null, '../../../images')
    },
    filename: function (req, file, cb) {
        console.log("naming file");
        cb(null, "name")
    }
});
const upload = multer({ storage: storage });

app.post('*',/* auth,*/ upload.single('image'), async (req, res) => {

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
            await sharp(req.file.path).resize(1000, 1000, {
                fit: 'contain'
            }).toFile('processed.png')
                .then(newImg => {
                    console.log("resizing successful");
                    return newImg;
                });
        img = 'processed.png';
        console.log(resizedImage);
    }
    const labelData = (await tesseract(img));
    console.log(labelData);

    return res.status(200).json({
        result: {
            finalData: labelData
        },
        message: "Processing Complete",
    });
});
module.exports = app;