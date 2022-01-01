const router = require('express').Router();
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

function prepareSource(filePath, data, templateName = 'main') {
  let partialSource = fs.readFileSync(path.resolve(filePath)).toString();
  handlebars.registerPartial(templateName, handlebars.compile(partialSource));
  let template = handlebars.compile(fs.readFileSync(path.resolve(`${__dirname}/../assets/hbs/main.hbs`)).toString());
  return template(data);
}

router.get('/', (req, res) => {
  res.send(prepareSource(`${__dirname}/../assets/hbs/dashboard.hbs`, {}));
});

router.get('/icons', (req, res) => {
  res.send(prepareSource(`${__dirname}/../assets/hbs/icons.hbs`, {}));
});

router.get('/login', (req, res) => {
  res.sendFile(path.resolve('./assets/html/login.html'));
});

router.get('/map', (req, res) => {
  res.send(prepareSource(`${__dirname}/../assets/hbs/map.hbs`, {}));
});

router.get('/maps', (req, res) => {
  res.send(prepareSource(`${__dirname}/../assets/hbs/maps.hbs`, {}));
});

router.get('/profile', (req, res) => {
  res.send(prepareSource(`${__dirname}/../assets/hbs/profile.hbs`, {}));
});

router.get('/register', (req, res) => {
  res.sendFile(path.resolve('./assets/html/register.html'));
});

router.get('/tables', (req, res) => {
  res.send(prepareSource(`${__dirname}/../assets/hbs/tables.hbs`, {}));
});

module.exports = router;
