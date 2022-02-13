const mongoose = require("mongoose");
const env = require('./environment.js');

mongoose.Promise = global.Promise;
let isConnected;

// Note: This should be stored in environment variables
const DB_URL = env.databaseConnect;


const connectToDatabase = () => {
    if (isConnected) {
        console.log("=> using existing database connection");
        return Promise.resolve();
    }

    console.log("=> using new database connection");
    return mongoose
        .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(db => {
            isConnected = db.connections[0].readyState;
        });
};

module.exports = connectToDatabase;
