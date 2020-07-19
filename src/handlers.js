const axios = require('axios');

let id = 0;
const sessions = {};

const clientID = 'f208c210845e35eb5151';
const clientSecret = '656134cc75725eb04b4ccb48a88384a8e3c9db48';

const logRequest = function (req, res, next) {
  console.log(req.method, req.url);
  next();
};

const insertUserName = function (userName) {
  sessions[++id] = userName;
  return id;
};

const getUserInfo = function (accessToken) {
  return axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `token ${accessToken}`,
      accept: 'application/json',
    },
  });
};

const getAccessToken = function (code) {
  return axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${code}`,
    headers: {
      accept: 'application/json',
    },
  });
};

const registerSession = async function (accessCode) {
  let userName;
  const { access_token: accessToken } = await getAccessToken(accessCode);

  if (accessToken) {
    const userInfo = getUserInfo(accessToken);
    userName = userInfo.login;
  }

  if (userName) {
    return insertUserName(userName);
  } else {
    throw 'Unauthorized';
  }
};

const processAuthCode = function (req, res) {
  registerSession(req.query.code)
    .then((sessionID) => {
      res.cookie('sesID', sessionID);
      res.redirect('/userPage');
    })
    .catch(() => {
      res.status(401).end();
    });
};

const renderUserPage = function (req, res) {
  const { sesID } = req.cookie;
  const userName = sessions[sesID];

  if (userName) {
    res.status(401).end();
    return;
  }

  res.render('user', { userName });
};

module.exports = { logRequest, processAuthCode, renderUserPage };
