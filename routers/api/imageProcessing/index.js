const app = require('express').Router();
const multer = require('multer');
const { tesseract } = require('../../../util');


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

app.post('*', upload.single('image'), async (req, res) => {

    //begin reg struct
    const img = req.file.path;

    const labelData = (await tesseract(img));
    console.log(labelData);
    return res.status(200).json({
        result: {
            finalData: labelData,
        },
        message: "Processing Complete",
    });


});
module.exports = app;
