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

router.get('/login', (req, res) => {
  res.sendFile(path.resolve('./assets/html/login.html'));
});

router.get('/register', (req, res) => {
  res.sendFile(path.resolve('./assets/html/register.html'));
});

router.use((req, res, next) => {
  if (!req.session.username) {
    return res.redirect(301, '/login');
  }
  next();
});

router.get('/', (req, res) => {
  res.send(prepareSource(`${__dirname}/../assets/hbs/dashboard.hbs`, {
    username: req.session.username,
  }));
});

router.get('/susPackageReport', (req, res) => {
  res.send(prepareSource(`${__dirname}/../assets/hbs/susPackageReport.hbs`, {
    username: req.session.username,
  }));
});

router.get('/usageStatistics', (req, res) => {
  res.send(prepareSource(`${__dirname}/../assets/hbs/usageStatistics.hbs`, {
    username: req.session.username,
  }));
});

router.get('/maps', (req, res) => {
  res.send(prepareSource(`${__dirname}/../assets/hbs/maps.hbs`, {
    username: req.session.username,
  }));
});

router.get('/recipientInfo', (req, res) => {
  res.send(prepareSource(`${__dirname}/../assets/hbs/recipientInfo.hbs`, {
    username: req.session.username,
  }));
});

router.get('/packageInfo', (req, res) => {
  res.send(prepareSource(`${__dirname}/../assets/hbs/packageInfo.hbs`, {
    username: req.session.username,
  }));
});

module.exports = router;
