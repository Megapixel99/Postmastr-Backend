const router = require('express').Router();
const path = require('path');

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
