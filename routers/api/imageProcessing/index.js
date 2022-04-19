const multer = require('multer');
const { tesseract, } = require('../../../util');
const sharp = require('sharp');
const path = require('path');
const app = require('express').Router();
const auth = require("../../../middleware/auth");
const uuid = require('uuid').v4;

const upload = multer({ storage: multer.memoryStorage(), limits: { fieldSize: 25 * 1024 * 1024 } });

app.post('*',/* auth, */upload.single('image'), async (req, res) => {
  let img = `${__dirname}/../../../images/${uuid()}-processed.jpg`;

  console.log(req.file);
  let resJson = {
    result: {
      finalData: null,
      message: "Image Not Found",
    },
   
  }
  /*
  var inputFile;
  const imgBuffer = Buffer.from(req.body.image, `base64`);
  let imgSize = (await sharp(imgBuffer).metadata).size;
  if (imgSize <= 250000) {
    inputFile = (await sharp(imgBuffer).resize(1000, 1000, { fit: 'contain' }).toFile(img));
  } else {
    inputFile = (await sharp(imgBuffer).toFile(img));
  }
  */
  if (req.file) {
    console.log("use req.file");
    resizedImage =(await sharp(req.file.buffer).resize(1000, 1000,{fit:'contain'}).toFile(img));
    resJson.result.message = "image found";
  } else if (req.body.image) {
    console.log("use req.body");

    resizedImage=(await sharp(Buffer.from(req.body.image, 'base64')).toFile(img));
    resJson.result.message = "image found";
  } else {
    return res.status(400).json(resJson);
  }
 // console.log(inputFile);
  console.log("processing new image");
  resJson.result.finalData = (await tesseract(img));
  return res.status(200).json(resJson);
});
module.exports = app;