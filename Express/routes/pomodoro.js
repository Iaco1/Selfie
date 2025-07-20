const dbUtils = require('../utils/dbUtils');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
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



router.get('/:userid', async (req, res) => {
  try{
    let pomodoro;
    console.log(typeof req.params.userid, " typeof userid in request");
    if(req.query.pomodoroId) pomodoro = await dbUtils.getPomodoros(req.params.userid, req.query.pomodoroId);
    else pomodoro = await dbUtils.getPomodoros(req.params.userid);
    console.log("fetch successful");
    res.json({
      status: 200,
      message: "fetch successful",
      pomodoro: pomodoro
    });
  }catch (err){
    console.log("fetch failed with error: ", err);
  }
})

module.exports = router;