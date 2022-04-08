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
                return res.status(403).json({
                    message: "package already in system",
                });

            } else {
                const recipient = req.body.recipient;
                const carrier = req.body.carrierName;
                const trackingNo = req.body.trackingNumber;
                const email = req.body.recipientMail;
                const newPackage = new Package({
                    recipient: recipient,
                    recipientMail: email,
                    carrierName: carrier,
                    trackingNumber: trackingNo,
                    dateRecieved: new Date(),
                })
                newPackage.save().then(() => {
                   // Recipient.updateOne({email: newPackage.recipientMail},);find way to update packagesId array
                    nodeMailer(newPackage);
                }).then(()=>{
                    return res.status(201).json({
                      package: newPackage,
                      message: "package logged"
                    });
                })
            }
        })
        .catch(error => {
            return res.status(error.statusCode || 500).json({
                error: error.message,
            });
        });
});

module.exports = app;
