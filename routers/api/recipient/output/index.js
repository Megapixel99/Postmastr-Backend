const app = require('express').Router();
const connectDB = require('../../../../util/db.js');
const { Recipient } = require('../../../../models/models.js');
app.get('*', (req, res) => {
    connectDB()
    .then(() => Recipient.find(req.query))
    .then(recipients => res.status(200).json(recipients))
    .catch(error =>
      res.status(error.statusCode || 500)
      .json({ error: error.message })
    );
  });
  module.exports = app;