const app = require('../../util/configureApi.js');
const connectDB = require('../../util/db.js');
const Recipient = require('../../models/Recipient.js');

app.post('*', (req, res) => {
    connectDB()
        .then(() => {
            return Recipient.findOne({ idNumber: req.body.idNumber });

        }).then(recipient => {
            if (recipient) {
                console.log("duplicate");
                throw new Error("Recipient is already within our system");

            } else {
                const name = req.body.name;
                const boxNumber = req.body.boxNumber;
                const email = req.body.email;
                const idNumber = req.body.idNumber
                const newRecipient = new Recipient({
                    name: name,
                    boxNumber: boxNumber,
                    email: email,
                    idNumber: idNumber,



                });
                newRecipient.save().then(() => {
                    res.status(200).json({
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
            res.status(error.statusCode || 500).json({
                error: error.message,
            });
        });
});

module.exports = app;