const expressSess = require('express-session');
const MongoStore = require('connect-mongo');
const env = require('./environment.js');

const { sessionSecret, databaseConnect, httpOnly } = env;

module.exports = expressSess({
  secret: sessionSecret,
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: databaseConnect,
    autoRemove: 'interval',
    ttl: 24 * 60 * 60, // 1 day
    autoRemoveInterval: 24 * 60, // 1 day
  }),
  cookie: {
    path: '/',
    httpOnly,
    secure: httpOnly,
    maxAge: null,
  },
});
