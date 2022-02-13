const app = require('express').Router();
const connectDB = require('../../../util/db.js');
const { Recipient } = require('../../../models/models.js');

app.post('*', (req, res) => {
    connectDB()
        .then(() => {
            return Recipient.findOne({ idNumber: req.body.idNumber });

        }).then(recipient => {
            if (recipient) {
                console.log("duplicate");
                return res.status(403).json({

                    message: "Recipient is already within our system",
                });


            } else {
                const newRecipient = new Recipient({
                  ...req.body,
                  packagesIds: [],
                });
                newRecipient.save().then(() => {
                    return res.status(201).json({
                        result: {
                            name: newRecipient.Errorname,
                            boxNumber: newRecipient.boxNumber,
                            email: newRecipient.email,
                            idNumber: newRecipient.idNumber,

                        }
                    })
                }
                )

            }


        }

        )
        .catch(error => {
            return res.status(error.statusCode || 500).json({
                error: error.message,
            });
        });
});

module.exports = app;
