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
    const user = dbUtils.getUserByEmail(userCollection, req.params.token);
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
      message: "error fetching userCollection"
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
    res.json({
      status: 500,
      message: "deletion failed"
    })
  });
});

module.exports = router;