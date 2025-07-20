const express = require('express');
const app = express();
const dbUtils = require('../utils/dbUtils');
const router = express.Router();
const cryptoUtils = require('../utils/cryptoUtils');

app.use(express.json());



function authenticateCredentials(username, password, user) {
  const hash = cryptoUtils.hash(password, user.salt);
    if (hash === user.hash) {
      console.log("hashes match");
      return {
        status: 200,
        message: "authentication successful",
        authToken: user._id
      }
    }
    else{
      console.log("hashes don't match");
      return {
        status: 401,
        message: "failed hash match"
      }
    }
}

function authenticateToken(token, id) {
  if(token === id){
    return {
      status: 200,
      message: "authentication successful",
    }
  }else{
    return {
      status: 401,
      message: "failed token match"
    }
  }
}

async function authenticate(body, verbose = false) {
  const timestamp = new Date().toISOString();
  let user;
  try{
    //differentiate between authenticating with token and with credentials
    if(body.authToken){
      user = dbUtils.getUserById(body.authToken);
      console.log(`${timestamp} - authenticating ${body.authToken}`);
      return authenticateToken(body.authToken, user._id);
    }else{
      user = dbUtils.getUserByUsername(body.username);
      console.log(`${timestamp} - authenticating %s:%s`, body.username, body.password);
      return authenticateCredentials(body.username, body.password, user);
    }
  }catch (err){
    console.error('Error fetching user: ', err);
    return {
      status: 500,
      message: "error fetching user"
    }
  }
}

router.post('/', function (req, res, next) {
  if(!req.body) return res.json({
    status: 400,
    message: "request body is empty"
  })

  authenticate(req.body).then(response => {
    res.json(response);
  }).catch(err => {
    res.json(err);
  })
});


module.exports = router;