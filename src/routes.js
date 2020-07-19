const express = require('express');
const cookieParser = require('cookie-parser');
const { logRequest, processAuthCode, renderUserPage } = require('./handlers');
const app = express();

app.set('view engine', 'pug');
app.use(cookieParser());
app.use(logRequest);
app.use(express.static('public'));

app.get('/oauth/codeResponse', processAuthCode);
app.get('/userPage', renderUserPage);

module.exports = { app };
