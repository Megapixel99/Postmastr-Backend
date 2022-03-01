const app = require('express').Router();
const connectDB = require('../../../util/db.js');
const { User } = require('../../../models/models.js');
const bcrypt = require('bcryptjs');
const env = require('../../../util/environment.js');
const jwt = require("jsonwebtoken");

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
                    const token = jwt.sign(
                        { user_id: user._id, username },
                        env.jwtToken,
                        {
                            expiresIn: "2h",
                        }
                    );
                    // save user token
                    user.token = token;
                    req.session.user = finalUser.username;
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
