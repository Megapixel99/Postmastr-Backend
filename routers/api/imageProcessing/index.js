const app = require('express').Router();
const { multer, tesseract } = require('../../../util');


app.post('*', multer.single('scan'), (req, res) => {
    res.sendstatus(202)


});




module.exports = app;
