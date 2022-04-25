const { createWorker } = require('tesseract.js');
const connectDB = require('./db.js');
const path = require('path');
const app = require('express').Router();
const models = require('../models/models.js');
const labelExtractor = require('./labelExtractor.js');

module.exports = function (imagePath) {
    return (async () => {
        const worker = createWorker({
            logger: () => null,
            langPath: path.resolve('./mlData'),
        });
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(imagePath);
        await worker.terminate();
        capsText = text.toUpperCase(); //Convert text to uppercase for uniformity
        console.log(capsText);
        return labelExtractor(capsText);
    })();
};
