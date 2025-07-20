const dbUtils = require('../utils/dbUtils');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  console.log("post requested for pomodoro:", req.body);
  if(!req.body){
    console.log("request body is empty");
    return res.json({
      status: 400,
      message: "request body is empty"
    })
  }

  try{
    const user = await dbUtils.getUserById(req.body.authorId);
    console.log("found user: ", user.username);
    req.body.authorUsername = user.username;
    const result = await dbUtils.insertPomodoro(req.body);
    console.log("response: ", result.message);
    res.json(result);
  }catch (err){
    console.log("insertion failed with error: ", err);
    return res.json({
      status: 500,
      message: `insertion failed with error ${err}`
    })
  }
})

module.exports = router;