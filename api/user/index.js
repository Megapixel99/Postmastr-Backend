const app = require('../../util/configureApi.js');
const connectDB = require('../../util/db.js');
const User = require('../../models/User.js');
app.post('*', (req, res) => {
    connectDB()
        .then(() => {
            const { name, pass } = req.body
            User.create({ name, pass });



            res.status(200).send('endpoint reached for inserting user');
            res.end();

        })
        .catch(error => {
            res.status(error.statusCode || 500).json({
                error: error.message,
            });
        });
});

module.exports = app;