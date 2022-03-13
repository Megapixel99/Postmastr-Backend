const { createWorker } = require('tesseract.js');
const path = require('path');
const app = require('express').Router();
const models = require('../models/models.js');

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

        const regex = RegExp(/#\s[0-9]{4}/);
        let boxNum = parseInt(regex.exec(text).toString().substring(2));
        console.log(boxNum);
        const matches = [];

        models.Recipient.find( { boxNumber: boxNum }, function(err, recipient) {
            console.log("test");
            if (err) {
                console.error('Unexpected error occured:');
                console.error(err);
                return;
            } if (!recipient || recipient.length === 0) {
                console.log('No box number was found');
                return;
            }
            for (let i = 0; i < recipient.length; i += 1) {
                if (boxNum === recipient[i].boxNumber) {
                    console.log("it worked!!!!!!!!!!!!!!!!!");
                    matches.push(recipient[i]);
                    console.log(matches);
                }
            }
        });

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
        let toAddress = pt2.slice(0, 4).join();
        if (pt2[5].length < 15) {
            tracking = pt2[6];
        } else {
            tracking = pt2[5]
        }
        console.log(text);
        console.log(tracking);
        console.log(toAddress);
        return text;
        ;
    })();
};