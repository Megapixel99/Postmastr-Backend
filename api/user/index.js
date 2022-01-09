const app = require('../../util/configureApi.js');
const connectDB = require('../../util/db.js');
const User = require('../../models/User.js');
app.post('*', (req, res) => {
    connectDB()
        .then(() => {
            //var reqUser = JSON.stringify(req.body.username);
            // var reqPass = JSON.stringify(req.body.password);
            // res.send(reqUser);
            // res.send(reqPass);
            console.log(req.body);
            const name = req.body.username;
            const pass = req.body.password;
            console.log(name);
            console.log(pass);





            return User.create({ username: name, password: pass });



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