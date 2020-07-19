const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

let sessionID = 0;
const sessions = {};

const clientID = 'f208c210845e35eb5151';
const clientSecret = '656134cc75725eb04b4ccb48a88384a8e3c9db48';

app.set('view engine', 'pug');
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use(express.static('./public'));

app.get('/oauth/codeResponse', (req, res) => {
  console.log(req.query.code);
  res.redirect('/userPage');
});

app.get('/userPage', (req, res) => {
  res.render('user', { name: 'default' });
});

app.listen(PORT, () => {
  console.log(`app started on ${PORT}...`);
});

// axios({
//   method: 'post',
//   url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=cbca964bbf1f81462d77`,
//   headers: {
//     accept: 'application/json',
//   },
// }).then((response) => {
//   console.log(response.data);
// });
// .catch((err) => {
//   console.log('err', err);
// });
