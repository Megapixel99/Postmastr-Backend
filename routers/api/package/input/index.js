const app = require('express').Router();
const connectDB = require('../../../../util/db.js');
const { Package, Recipient } = require('../../../../models/models.js');
const { nodeMailer } = require('../../../../util');


app.post('*', (req, res) => {
    connectDB()
        .then(() => {
            return Package.findOne({ trackingNumber: req.body.trackingNumber });
        }).then(package => {
            if (package) {
                console.log("duplicate");
                Promise.all([
                    nodeMailer(req.body),
                    Recipient.Package({trackingNumber: req.body.trackingNumber},{$inc:{emailsSent: 1}}),
                ]).then(function () {
                    return res.status(201).json({
                        package: package,
                        message: "package logged"
                    });
                }).catch(error => {
                    console.log(error);
                    return res.status(error.statusCode || 500).json({
                        error: error.message,
                    });
                });
            } else {
                const recipient = req.body.recipient;
                const carrier = req.body.carrierName;
                const trackingNo = req.body.trackingNumber;
                const email = req.body.recipientMail;
                const newPackage = new Package({
                    uuid: req.body.uuid,
                    recipient: recipient,
                    recipientMail: email,
                    carrierName: carrier,
                    trackingNumber: trackingNo,
                    dateRecieved: new Date(),
                    emailsSent: 1,
                })
                id = newPackage.uuid;
                newPackage.save().then(() => {
                    nodeMailer(newPackage);
                }).then(() => {
                    return res.status(201).json({
                        package: newPackage,
                        message: "package logged"
                    });
                })
            }
        })
        .catch(error => {
          console.log(error);
            return res.status(error.statusCode || 500).json({
                error: error.message,
            });
        });
});

module.exports = app;
