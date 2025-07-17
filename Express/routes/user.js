const dbUtils = require("../utils/dbUtils");
const router = require("./login");

router.get('/:token', async (req, res) => {
  console.log("requested user: ", req.params.token);

  if(!req.params.token)  res.json({
    status: 400,
    message: "authToken is empty"
  })

  try{
    const userCollection = await dbUtils.getUsers();
    const user = dbUtils.getUserById(userCollection, req.params.token);
    if(!user) throw new Error("user not found");
    console.log("fetch successful");
    res.json({
      status: 200,
      message: "fetch successful",
      user: user
    });
  }catch (err){
    console.error('Error fetching userCollection: ', err);
    res.json({
      status: 500,
      message: `error ${err}`
    })
  }
})

router.delete('/:token', async (req, res) => {
  console.log("requested user: ", req.params.token);
  if(!req.params.token)  res.json({
    status: 400,
    message: "authToken is empty"
  })

  await dbUtils.deleteUser(req.params.token).then(response => {
    res.json({
      status: 200,
      message: "deletion successful"
    });
  }).catch(err => {
    console.log("deletion failed: ", err);
    res.json({
      status: 500,
      message: "deletion failed"
    })
  });
});

router.put('/:token', async (req, res) => {
  console.log("requested user: ", req.params.token);
  if(!req.params.token)  res.json({
    status: 400,
    message: "authToken is empty"
  })

  try{
    //const body = JSON.stringify(req.body);
    await dbUtils.updateUser(req.params.token, req.body);
    res.json({
      status: 200,
      message: "update successful"
    })
  }catch (err){
    console.log("err: ", err);
    res.json({
      status: 500,
      message: `update failed, ${err}`
    })
  }

})

module.exports = router;