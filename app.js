var http = require('http'); // Import Node.js core module
const express = require('express');
const app = express();
const connectDB = require('util/db.js');
const User = require('models/User.js');
var server = http.createServer(function (req, res) {   //create web server
    if (req.url == '/') { //check the URL of the current request

        // set response header
        res.writeHead(200, { 'Content-Type': 'text/html' });

        // set response content    
        res.write('<html><body><p>This is home Page.</p></body></html>');
        res.end();

    }
    else if (req.url.includes("student")) {

        console.log('works');
        userDetails = new User({
            username: "Jim",
            password: "password",

        });
        connectDB().then(() => {
            return userDetails.username;

        });
        console.log("db connected")


        res.end();

    }
    else if (req.url.includes("admin")) {

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><body><p>This is admin Page.</p></body></html>');
        res.end();

    }
    else
        res.end('Invalid Request!');

});

server.listen(5000); //6 - listen for any incoming requests


console.log('Node.js web server at port 5000 is running..')