const router = require('express').Router();
const handlebars = require('handlebars');
const path = require('path');

handlebars.registerPartial('main', handlebars.compile(fs.readFileSync(path.resolve(`${__dirname}/../assets/hbs/main.hbs`)).toString()));

function prepareSource(filePath, data) {
  const template = handlebars.compile(fs.readFileSync(path.resolve(`${__dirname}/../WebClient/hbs/layouts/base.hbs`)).toString());
  return template(data);
}

router.get('/', (req, res) => {
  res.sendFile(path.resolve('./assets/html/dashboard.html'));
});

router.get('/icons', (req, res) => {
  res.sendFile(path.resolve('./assets/html/icons.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.resolve('./assets/html/login.html'));
});

router.get('/map', (req, res) => {
  res.sendFile(path.resolve('./assets/html/map.html'));
});

router.get('/maps', (req, res) => {
  res.sendFile(path.resolve('./assets/html/maps.html'));
});

router.get('/profile', (req, res) => {
  res.sendFile(path.resolve('./assets/html/profile.html'));
});

router.get('/register', (req, res) => {
  res.sendFile(path.resolve('./assets/html/register.html'));
});

router.get('/tables', (req, res) => {
  res.sendFile(path.resolve('./assets/html/tables.html'));
});

router.get('/upgrade', (req, res) => {
  res.sendFile(path.resolve('./assets/html/upgrade.html'));
});

module.exports = router;
