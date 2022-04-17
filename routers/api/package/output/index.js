const app = require('express').Router();
const connectDB = require('../../../../util/db.js');
const { Package } = require('../../../../models/models.js');

app.get('*/:uuid', (req, res) => {
  connectDB()
  .then(() => Package.findOne({ uuid: req.params.uuid }))
  .then(packages => res.status(200).json(packages))
  .catch(error =>
    res.status(error.statusCode || 500)
    .json({ error: error.message })
  );
});

app.get('*/:packageID', (req, res) => {
  connectDB()
  .then(() => Package.findOneAndUpdate({uuid: req.params.packageID}
  , {pickedUp: true}))
  .then( package => res.send(package))
  .catch(error =>
    res.status(error.statusCode || 500)
    .json({ error: error.message })
  );
});

app.get('*', (req, res) => {
  connectDB()
  .then(() => Package.find(req.query))
  .then(packages => res.status(200).json(packages))
  .catch(error =>
    res.status(error.statusCode || 500)
    .json({ error: error.message })
  );
});

module.exports = app;
