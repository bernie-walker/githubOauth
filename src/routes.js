const express = require('express');
const { logRequest, processAuthCode, renderUserPage } = require('./handlers');
const app = express();

app.set('view engine', 'pug');
app.use(logRequest);
app.use(express.static('public'));

app.get('/oauth/codeResponse', processAuthCode);
app.get('/userPage', renderUserPage);

module.exports = { app };
