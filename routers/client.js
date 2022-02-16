const router = require('express').Router();
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const { db } = require('../util');
const { Package, Recipient, SusForm } = require('../models/models.js');
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
  handlebars.registerHelper('fixCamelCase', function (_str, options) {
    let str = _str.replace(/(.)([A-Z])/gm, '$1 $2');
    return `${str[0].toUpperCase()}${str.slice(1)}`;
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
    let emailSent = _.groupBy(packages.filter((e) => e.emailsSent > 0 && new Date(e.dateRecieved).getFullYear() === new Date().getFullYear()), (data) => months[new Date(data.dateRecieved).getMonth()]);
    let packagesScanned = _.groupBy(packages.filter((e) => new Date(e.dateRecieved).getFullYear() === new Date().getFullYear()), (data) => months[new Date(data.dateRecieved).getMonth()]);
    return res.send(prepareSource(`${__dirname}/../assets/hbs/dashboard.hbs`, {
      username: req.session.username,
      packages: {
        number: packages.length,
        total: {
          data: JSON.stringify(Object.values(packagesScanned).map((e) => e.length).reverse()),
          headers: JSON.stringify(Object.keys(packagesScanned).reverse()),
        },
        notPickedUp: packages.filter((e) => !e.pickedUp),
        confiscated: packages.filter((e) => e.confiscated),
        lost: packages.filter((e) => e.lost),
        emailsSent: {
          data: JSON.stringify(Object.values(emailSent).map((e) => {
            if (e.flat().length === 1) {
              return e[0].emailsSent;
            } else {
              return e.reduce(function(a,b){ return a.emailsSent + b.emailsSent; });
            }
          }).reverse()),
          headers: JSON.stringify(Object.keys(emailSent).reverse()),
        },
      },
    }));
  }).catch(function (err) {
    console.error(err);
    res.sendStatus(500);
  });
});

router.get('/find/susPackage', (req, res) => {
  db().then(() => SusForm.find(null, {__v: 0, _id: 0}).lean()).then(function (packages) {
    return res.send(prepareSource(`${__dirname}/../assets/hbs/findSusPackage.hbs`, {
      username: req.session.username,
      packages: packages.length !== 0 ? {
        headers: Object.keys(packages[0]).filter((e) => !['employeeNote', 'packageUUID', 'uuid'].includes(e)),
        rows: packages,
      } : [],
    }));
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
  }).catch(function (err) {
    console.error(err);
    res.sendStatus(500);
  });
});

router.get('/find/package', (req, res) => {
  db().then(() => Package.find(null, {__v: 0, _id: 0}).lean()).then(function (packages) {
    return res.send(prepareSource(`${__dirname}/../assets/hbs/findPackage.hbs`, {
      username: req.session.username,
      packages: packages.length !== 0 ? {
        headers: Object.keys(packages[0]).filter((e) => !['pickedUp', 'emailSent', 'uuid', 'confiscated', 'lost', 'dateRecieved', 'emailsSent'].includes(e)),
        rows: packages,
      } : [],
    }));
  }).catch(function (err) {
    console.error(err);
    res.sendStatus(500);
  });
});

router.get('/find/susPackage/:package', (req, res) => {
  db().then(() => SusForm.findOne({ uuid: req.params.package }, {__v: 0, _id: 0}).lean()).then(function (package) {
    delete package.uuid;
    package.linkToPackageInfo = `<a href='/find/package/${package.packageUUID}'>Package Info</a>`;
    package.employeeNote = package.employeeNote.length ? package.employeeNote : "<i>Note not found</i>";
    delete package.packageUUID;
    return res.send(prepareSource(`${__dirname}/../assets/hbs/susPackageReport.hbs`, {
      username: req.session.username,
      package,
    }));
  }).catch(function (err) {
    console.error(err);
    res.sendStatus(500);
  });
});

router.get('/find/package/:package', (req, res) => {
  db().then(() => Package.findOne({ uuid: req.params.package }, {__v: 0, _id: 0}).lean()).then(function (package) {
    delete package.uuid;
    return res.send(prepareSource(`${__dirname}/../assets/hbs/packageInfo.hbs`, {
      username: req.session.username,
      package,
    }));
  }).catch(function (err) {
    console.error(err);
    res.sendStatus(500);
  });
});

router.get('/find/recipient/:recipient', (req, res) => {
  db().then(() => Recipient.findOne({ idNumber: req.params.recipient }, {__v: 0, _id: 0}).lean()).then(function (recipient) {
    return res.send(prepareSource(`${__dirname}/../assets/hbs/recipientInfo.hbs`, {
      username: req.session.username,
      recipient,
    }));
  }).catch(function (err) {
    console.error(err);
    res.sendStatus(500);
  });
});

module.exports = router;
