const app = require('../../util/configureApi.js');
const connectDB = require('../../util/db.js');
const Recipient = require('../../models/Recipient.js');

app.post('*', (req, res) => {
    connectDB()
        .then(() => {
            //var reqUser = JSON.stringify(req.body.username);
            // var reqPass = JSON.stringify(req.body.password);
            // res.send(reqUser);
            // res.send(reqPass);
            console.log(req.body);
            const name = req.body.name;
            const boxNumber = req.body.boxNumber;
            const email = req.body.email;
            const idNumber = req.body.idNumber







            return Recipient.create({ name: name, boxnumber: boxNumber, email: email, idNumber: idNumber, });






        })
        .catch(error => {
            res.status(error.statusCode || 500).json({
                error: error.message,
            });
        });
});

module.exports = app;