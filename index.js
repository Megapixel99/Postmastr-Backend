const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const device = require('express-device');
const http = require('http');
const { sessions } = require('./util');

const app = express();

app.use(sessions);

app.set('json spaces', 2);
// app.use(require('helmet')());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' post-mastr-mvp.vercel.app fonts.googleapis.com fonts.gstatic.com");
  next();
});

// app.use(device.capture({ parseUserAgent: true }));

app.use('/user/signIn', require('./routers/api/user/signIn/index.js'));

app.use('/imageProcessing', require('./routers/api/imageProcessing/index.js'));
app.use('/user', require('./routers/api/user/index.js'));
app.use('/recipient', require('./routers/api/recipient/index.js'));
app.use('/package/input', require('./routers/api/package/input/index.js'));
app.use('/package/suspicious', require('./routers/api/package/suspicious/input/index.js'));
app.use('/package/output', require('./routers/api/package/output/index.js'));
app.use('/assets/css', express.static('./assets/css'));
app.use('/assets/fonts/nucleo', express.static('./assets/fonts/nucleo'));
app.use('/assets/img', express.static('./assets/img'));
app.use('/assets/js', express.static('./assets/js'));
app.use('/assets/scss', express.static('./assets/scss'));
app.use('/assets/vendor', express.static('./assets/vendor'));
app.use(require('./routers/client.js'));

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

app.use('/api', (req, res) => {
  res.status(404).json('Page Not found');
});

app.use((req, res) => {
  res.sendStatus(404);
});

// set up environment file(s)
// if (env.env === 'prod') {
//   https.createServer({
//     cert: fs.readFileSync(path.resolve(__dirname, env.certFullChainPath)),
//     key: fs.readFileSync(path.resolve(__dirname, env.certPrivateKeyPath)),
//   }, app).listen(443);
// } else {
http.createServer(app).listen(3000);
// }
