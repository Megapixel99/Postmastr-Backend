const app = require('../../../util/configureApi.js');
const connectDB = require('../../../util/db.js');
const Package = require('../../../models/Package.js');
app.post('*', (req, res) => {
    connectDB()
        .then(() => {

            console.log(req.body);
            const recipient = req.body.recipient;
            const sender = req.body.sender;
            const carrier = req.body.carrierName;
            const fromAddress = req.body.returnAddress;
            const toAddress = req.body.recipientAddress;
            const trackingNo = req.body.trackingNumber;

            return Package.create({ recipient: recipient, sender: sender, carrierName: carrier, returnAddress: fromAddress, recipientAddress: toAddress, trackingNumber: trackingNo });





        })
        .catch(error => {
            res.status(error.statusCode || 500).json({
                error: error.message,
            });
        });
});

module.exports = app;