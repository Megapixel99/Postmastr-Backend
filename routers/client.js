const router = require('express').Router();
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const { db } = require('../util');
const { Package, Recipient } = require('../models/models.js');
const _ = require('lodash');

let months = ['Jan', 'Feb', 'March', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

function prepareSource(filePath, data, templateName = 'main') {
  handlebars.registerHelper('ifOverFive', function (index, options) {
    if(index + 1 > 5){
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  handlebars.registerHelper('ifModFive', function (index, options) {
    if((index + 1) % 5 === 0){
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  handlebars.registerHelper('paginateByFive', function (index, options) {
    return Math.ceil((index + 1) / 5) + 1;
  });
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
  db().then(() => Package.find(null, {__v: 0, _id: 0}).lean()).then(function (packages) {
    return res.send(prepareSource(`${__dirname}/../assets/hbs/dashboard.hbs`, {
      username: req.session.username,
      packages: {
        total: packages,
        notPickedUp: packages.filter((e) => !e.pickedUp),
        confiscated: packages.filter((e) => e.confiscated),
        lost: packages.filter((e) => e.lost),
        emailsSent: _.groupBy(packages.filter((e) => e.emailsSent > 0 && new Date(e.recievedDate).getFullYear() === new Date().getFullYear()), (data) => months[new Date(data.recievedDate).getMonth()]),
      },
    }));
  }).catch(function (err) {
    console.error(err);
    res.sendStatus(500);
  });
});
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
  db().then(() => Recipient.find(null, {__v: 0, _id: 0}).lean()).then(function (recipients) {
    return res.send(prepareSource(`${__dirname}/../assets/hbs/findRecipient.hbs`, {
      username: req.session.username,
      recipients: recipients.length !== 0 ? {
        headers: Object.keys(recipients[0]).filter((e) => e !== "packages"),
        rows: recipients,
      } : [],
    }));
  });
});

router.get('/find/package', (req, res) => {
  db().then(() => Package.find(null, {__v: 0, _id: 0}).lean()).then(function (packages) {
    return res.send(prepareSource(`${__dirname}/../assets/hbs/findPackage.hbs`, {
      username: req.session.username,
      packages: packages.length !== 0 ? {
        headers: Object.keys(packages[0]),
        rows: packages,
      } : [],
    }));
  });
});

module.exports = router;
