const multer = require('multer');
const { tesseract, } = require('../../../util');
const sharp = require('sharp');
const path = require('path');
const app = require('express').Router();
const auth = require("../../../middleware/auth");
const uuid = require('uuid').v4;

const upload = multer({ storage: multer.memoryStorage(), limits: { fieldSize: 25 * 1024 * 1024 } });

app.post('*',/* auth, */upload.single('image'), async (req, res) => {
  let img = `${__dirname}/../../../images/${uuid()}-processed.png`;
  let resJson = {
    result: {
      finalData: null
    },
    message: "Image Not Found",
  }
  if (req.file) {
    (await sharp(req.file.buffer).resize(1000, 1000).toFile(img));
  } else if (req.body.image) {
    (await sharp(Buffer.from(req.body.image, 'base64')).resize(1000, 1000).toFile(img));
  } else {
    return res.status(400).json(resJson);
  }
  console.log("processing new image");
  resJson.result.finalData = (await tesseract(img));
  return res.status(200).json(resJson);
});
module.exports = app;
