const app = require('../../util/configureApi');
const connectDB = require('/Users/josephtang/seniorCapstone/MVP/server/util/db.js');
const User = require('/Users/josephtang/seniorCapstone/MVP/server/models/User.js');
app.post('*', (req, res) => {
    connectDB()
        .then(() => {
            return User.create(req.body);
        })
        .then(userItem => {
            res.status(200).json({
                result: userItem,
            });
        })
        .catch(error => {
            res.status(error.statusCode || 500).json({
                error: error.message,
            });
        });
});

module.exports = app;