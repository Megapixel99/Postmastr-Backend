const app = require('../../util/configureApi.js');
const connectDB = require('../../util/db.js');
const User = require('../../models/User.js');
import bcrypt from 'bcryptjs';


app.post('*', (req, res) => {
    connectDB()
        .then(() => {
            return User.findOne({ username: req.body.username });
        }).then(user => {
            if (user) {
                console.log("duplicate");
                //throw new Error("You tried to create a duplicate");
                return res.status(403).json({

                    message: "You tried to create a duplicate",
                });
            } else {
                const name = req.body.username;
                const pass = bcrypt.hashSync(req.body.password, 6);
                //User.create({ username: name, password: pass });
                const newUser = new User({ username: name, password: pass });
                newUser.save().then(() => {
                    return res.status(201).json({
                        result: {
                            username: newUser.username,
                            password: newUser.password,
                        }
                    });
                }

                )
            }

        }).catch(error => {
            return res.status(error.statusCode || 500).json({
                error: error.message,
            });
        });


});

module.exports = app;
