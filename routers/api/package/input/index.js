const app = require('express').Router();
const connectDB = require('../../../../util/db.js');
const { Package } = require('../../../../models/models.js');
const nodemailer = require("nodemailer");
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
                const newPackage = new Package({
                    recipient: recipient,
                    carrierName: carrier,
                    recipientAddress: toAddress,
                    trackingNumber: trackingNo,
                    dateRecieved: new Date(),
                })
                const transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    auth: {
                        user: 'evelyn.vandervort92@ethereal.email',
                        pass: 'pZCd8GrvNeCxr3a4tY'
                    }
                });
                let info = await transporter.sendMail({
                    from: '"Fred Foo 👻" <foo@example.com>', // sender address
                    to: "bar@example.com, baz@example.com", // list of receivers
                    subject: "Hello ✔", // Subject line
                    text: "Hello world?", // plain text body
                    html: "<b>Hello world?</b>", // html body
                  });

                newPackage.save().then(() => {
                    return res.status(201).json({
                        result: newPackage
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
