const express = require('express');
const app = express();
const router = express.Router();
const dbUtils = require('../utils/dbUtils');
app.use(express.json());


async function signup(user) {
  await dbUtils.insertUser(user);
}

router.post('/', async function(req, res){
  console.log(`request session: ${req.session}`);
  if(!req.body) return res.json({
    status: 400,
    message: "request body is empty"
  })


  try{
    await signup(req.body);
    console.log("insertion successful");
    res.json({
      status: 200,
      message: "insertion successful"
    })
  }catch (err){
    console.log("insertion failed");
  }

})

module.exports = router;