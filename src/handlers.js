const axios = require('axios');

let sessionID = 0;
const sessions = {};

const clientID = 'f208c210845e35eb5151';
const clientSecret = '656134cc75725eb04b4ccb48a88384a8e3c9db48';

const logRequest = function (req, res, next) {
  console.log(req.method, req.url);
  next();
};

const processAuthCode = function (req, res) {
  console.log(req.query.code);
  res.redirect('/userPage');
};

const renderUserPage = function (req, res) {
  res.render('user', { name: 'default' });
};

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

module.exports = { logRequest, processAuthCode, renderUserPage };
