const app = require('express').Router();
const connectDB = require("../../../../util/db.js");
const { User } = require('../../../../models/models.js');
const bcrypt = require("bcryptjs");
const env = require('../../../../util/environment.js');
app.post("*", (req, res) => {
    let finalUser;
    connectDB()
        .then(() => {
            return User.findOne({ username: req.body.username });
        }).then(user => {
            if (!user) {
                console.log("No user found");
                return res.status(404).json({
                    result: {
                        username: null,
                    },
                    message: "No user found",
                });
            }
            finalUser = user;
            console.log("user found");
            bool = user.comparePassword(req.body.password);
            if (!bool) {
                console.log("Invalid password");
                return res.status(401).json({
                    result: {
                        username: null,
                    },
                    message: "Invalid password",
                });

            } else {
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
                return res.status(200).json({
                    result: {
                        username: finalUser.username,
                    },
                    message: "User found",
                });
            }
        })/*.then(finalUser => {
            res.status(200).json({
                result: {
                    username: finalUser.username,
                    password: finalUser.password,
                }
            });
        })*/
        .catch(err => {
            res.status(err.statusCode || 500).json({
                error: err.message
            });
        });
});

module.exports = app;
