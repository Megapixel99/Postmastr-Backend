const multer = require('multer');
const { tesseract, labelExtractor, environment: env } = require('../../../util');
const sharp = require('sharp');
const path = require('path');
const app = require('express').Router();
const auth = require("../../../middleware/auth");
const uuid = require('uuid').v4;
const axios = require('axios');
var FormData = require('form-data');
const request = require('superagent');

const upload = multer({ storage: multer.memoryStorage(), limits: { fieldSize: 25 * 1024 * 1024 } });

app.post('*',/* auth, */upload.single('image'), async (req, res) => {
  let img = `${__dirname}/../../../images/${uuid()}-processed.jpg`;

  console.log(req.file);
  let resJson = {
    result: {
      uuid: uuid(),
      finalData: null,
      message: "Image Not Found"
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
  let file;
  if (req.file) {
    console.log("use req.file");
    file = (await sharp(req.file.buffer).toFile(img));
    resJson.result.message = "image found";
  } else if (req.body.image) {
    console.log("use req.body");
    file = (await sharp(Buffer.from(req.body.image, 'base64')).toFile(img));
    resJson.result.message = "image found";
  } else {
    return res.status(400).json(resJson);
  }
   if (req.query.ocr === "ocrspace") {
     const formData = new FormData();
     formData.append('language', 'eng');
     formData.append('isOverlayRequired', 'false');
     formData.append('iscreatesearchablepdf', 'true');
     formData.append('issearchablepdfhidetextlayer', 'false');
     formData.append('OCREngine', '2');
     let buffer;
     if (file.size/1000000 > 1) { //convert file size to megabytes for comparison
       let size = 500;
       do {
         buffer = (await request.post(`https://im2.io/${(env.compressionUsername).toString()}/${size}x${size},fit`).attach('file', path.resolve(img))).body;
         file = (await sharp(buffer).toFile(img));
         size = Math.floor(size/2);
       } while (file.size/1000000 > 1);
     } else {
       buffer = (await sharp(img).toBuffer());
     }
     formData.append('base64image', `data:image/jpeg;base64,${buffer.toString('base64')}`);
     let response = (await axios.post('https://api.ocr.space/parse/image', formData, {
       headers: {
         'apikey': (env.ocrApiKey).toString(),
         ...formData.getHeaders(),
         "Content-Length": formData.getLengthSync()
       }
     }));
     console.log(response);
     if (response.data.ParsedResults && response.data.ParsedResults[0] && response.data.ParsedResults[0].ParsedText) {
       let labelData = (await labelExtractor(response.data.ParsedResults[0].ParsedText));
       if (response.data.SearchablePDFURL) {
         labelData.pdfUrl = response.data.SearchablePDFURL
       }
       resJson.result.finalData = labelData
       return res.status(200).json(resJson);
     } else {
       resJson.result.finalData = (await labelExtractor(''));
       return res.status(200).json(resJson);
     }
   } else {
     if (file.width < 1000 || file.height < 1000) {
       file = (await sharp(img).resize(1000, 1000, {fit:'contain'}).toFile(img));
     }
    console.log("processing new image");
    resJson.result.finalData = (await tesseract(img));
    return res.status(200).json(resJson);
   }
});
module.exports = app;
