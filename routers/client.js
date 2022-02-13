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

router.use((req, res, next) => {
  const nonSessionRoutes = ['/login', '/register'];
  if (nonSessionRoutes.includes(req.path) && req.session.username) return res.redirect('/');
  if (nonSessionRoutes.includes(req.path)) return next();
  if (!req.session.username) return res.redirect('/login');
  next();
});

router.get('/login', (req, res) => {
  return res.sendFile(path.resolve('./assets/html/login.html'));
});

router.get('/register', (req, res) => {
  return res.sendFile(path.resolve('./assets/html/register.html'));
});

router.get('/', (req, res) => {
  return res.send(prepareSource(`${__dirname}/../assets/hbs/dashboard.hbs`, {
    username: req.session.username,
  }));
});

router.get('/susPackageReport', (req, res) => {
  return res.send(prepareSource(`${__dirname}/../assets/hbs/susPackageReport.hbs`, {
    username: req.session.username,
  }));
});

router.get('/usageStatistics', (req, res) => {
  return res.send(prepareSource(`${__dirname}/../assets/hbs/usageStatistics.hbs`, {
    username: req.session.username,
  }));
});

router.get('/maps', (req, res) => {
  return res.send(prepareSource(`${__dirname}/../assets/hbs/maps.hbs`, {
    username: req.session.username,
  }));
});

router.get('/find/recipient', (req, res) => {
  return res.send(prepareSource(`${__dirname}/../assets/hbs/findRecipient.hbs`, {
    username: req.session.username,
  }));
});

router.get('/find/package', (req, res) => {
  return res.send(prepareSource(`${__dirname}/../assets/hbs/findPackage.hbs`, {
    username: req.session.username,
  }));
});

module.exports = router;
