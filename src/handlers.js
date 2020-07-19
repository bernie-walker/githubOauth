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

const extractAndResolve = function (resolve, response, extractionKey) {
  resolve(response.data[extractionKey]);
};

const fetchAuthData = function (config, extractionKey) {
  return new Promise((resolve) => {
    axios(config).then((response) => {
      extractAndResolve(resolve, response, extractionKey);
    });
  });
};

const generateUserInfoConfig = function (accessToken) {
  return {
    url: 'https://api.github.com/user',
    headers: {
      Authorization: `token ${accessToken}`,
      accept: 'application/json',
    },
  };
};

const generateAccessTokenConfig = function (code) {
  return {
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${code}`,
    headers: {
      accept: 'application/json',
    },
  };
};

const registerSession = async function (accessCode) {
  let userName;
  const accessToken = await fetchAuthData(
    generateAccessTokenConfig(accessCode),
    'access_token'
  );

  if (accessToken) {
    userName = await fetchAuthData(
      generateUserInfoConfig(accessToken),
      'login'
    );
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
  const { sesID } = req.cookies;
  const userName = sessions[sesID];

  if (!userName) {
    res.status(401).end();
    return;
  }

  res.render('user', { userName });
};

module.exports = { logRequest, processAuthCode, renderUserPage };
