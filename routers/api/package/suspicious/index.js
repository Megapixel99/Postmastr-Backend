const app = require('express').Router();
const connectDB = require('../../../../util/db.js');
const { Package } = require('../../../../models/models.js');

app.post('*', (req, res) => {
  connectDB()
  .then(() =>
    new SusForm(req.body).save()
  )
  .then(packages => res.status(200).json(packages))
  .catch(error =>
    res.status(error.statusCode || 500)
    .json({ error: error.message })
  );
});

app.get('*', (req, res) => {
  connectDB()
  .then(() => SusForm.find(req.query))
  .then(susForms => res.status(200).json(susForms))
  .catch(error =>
    res.status(error.statusCode || 500)
    .json({ error: error.message })
  );
});

app.get('*/:uuid', (req, res) => {
  connectDB()
  .then(() => SusForm.findOne({ uuid: req.params.uuid }))
  .then(susForms => res.status(200).json(susForms))
  .catch(error =>
    res.status(error.statusCode || 500)
    .json({ error: error.message })
  );
});

module.exports = app;
