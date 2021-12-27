const app = require('../../util/configureApi');
const connectDB = require('/Users/josephtang/seniorCapstone/MVP/server/util/db.js');
const User = require('/Users/josephtang/seniorCapstone/MVP/server/models/User.js');
app.get('*', (req, res) => {
    connectDB()
        .then(() => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<html><body><p>This is admin Page.</p></body></html>');
            res.end();

        })
        .catch(error => {
            res.status(error.statusCode || 500).json({
                error: error.message,
            });
        });
});

module.exports = app;