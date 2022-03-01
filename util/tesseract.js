const { createWorker } = require('tesseract.js');
const path = require('path');
const app = require('express').Router();

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
        capsText = text.toUpperCase();//Convert text to uppercase for uniformity
        //split label at Ship To: or To: line 
        if (capsText.includes("SHIP TO/:/g") || capsText.includes("SHIP\nTO/:/g")) {
            sliceStart = capsText.indexOf("SHIP");
            sliceEnd = sliceStart + 7;
        } else {
            sliceStart = capsText.indexOf("TO: ");
            sliceEnd = sliceStart + 3;
        }
        pt1 = capsText.substr(0, sliceStart).split("\n");
        pt2 = capsText.substr(sliceEnd, capsText.length - 1).split("\n");
        console.log(pt1);
        console.log(pt2);
        return "stub";








        ;
    })();
};