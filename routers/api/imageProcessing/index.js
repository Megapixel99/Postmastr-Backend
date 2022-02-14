const app = require('express').Router();
const multer = require('multer');
const { tesseract } = require('../../../util');
//const { storage } = require('../../../util');

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

app.post('*', upload.single('image'), (req, res) => {

    //begin reg struct
    const img = req.file.path;
    //console.log(img);

    const labelData = tesseract(img);
    console.log(labelData);
    return res.status(200).json({
        result: {
            finalData: labelData,
        },
        message: "Processing Complete",
    });


});
module.exports = app;

/*const router = require('express').Router();
const multer = require('multer');



const upload = multer({ storage: storage });


router.post('*', upload.single('image'), (req, res) => {
    res.sendStatus(202);
    console.log("In route:");
    console.log(req.file);
});

module.exports = router; */
