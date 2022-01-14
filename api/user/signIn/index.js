const app = require("../../../util/configureApi.js");
const jwt = require('jsonwebtoken');
const connectDB = require("../../../util/db.js");
const User = require("../../../models/User.js");
app.post("*", (req, res) => {
    let finalUser;
    connectDB()
        .then(() => {
            return User.findOne({ username: req.body.username });
        }).then(user => {
            if (!user) {
                console.log("No user found");
                res.status(404).json({
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
                res.status(401).json({
                    result: {
                        username: null,
                    },
                    message: "Invalid password",
                });

            } else {
                res.status(200).json({
                    result: {
                        username: finalUser.username,
                    },
                    message: "User found",
                });

        }).then(isPasswordCorrect => {
            if (!isPasswordCorrect) {
                throw new Error('Invalid password')
            }
            next();
        }).then(finalUser => {
            res.status(200).json({
                result: {
                    username: finalUser.username,
                    password: finalUser.password,
                }
            });
        })
        .catch(err => {
            res.status(err.statusCode || 500).json({
                error: err.message
            });
        });
});

module.exports = app;
