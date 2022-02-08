const app = require('express').Router();
const connectDB = require('../../../../util/db.js');
const { Package } = require('../../../../models/models.js');
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
                const sender = req.body.sender;
                const carrier = req.body.carrierName;
                const fromAddress = req.body.returnAddress;
                const toAddress = req.body.recipientAddress;
                const trackingNo = req.body.trackingNumber;
                const newPackage = new Package({
                    recipient: recipient,
                    sender: sender,
                    carrierName: carrier,
                    returnAddress: fromAddress,
                    recipientAddress: toAddress,
                    trackingNumber: trackingNo,






                })
                newPackage.save().then(() => {
                    return res.status(201).json({
                        result: {
                            recipient: newPackage.recipient,
                            sender: newPackage.sender,
                            carrierName: newPackage.carrierName,
                            returnAddress: newPackage.returnAddress,
                            recipientAddress: newPackage.recipientAddress,
                            trackingNumber: newPackage.trackingNumber,

                        }
                    })

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
