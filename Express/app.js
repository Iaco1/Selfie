const express = require('express');
const app = express();
const port = 3002;
const login = require('./modules/login');
const signup = require('./modules/signup');
const mongoose = require("mongoose");
const config = require('./config');
const dbUtils = require("./utils/dbUtils");

app.use(express.json());

app.use("/auth", login);
app.use("/signup", signup);

app.get('/user/:token', async (req, res) => {
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

mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log('Error connecting to MongoDB:', err);
})





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


process.on('SIGINT', async () => {
    mongoose.connection.close().then(() => {
      console.log('Connection to mongodb closed');
      process.exit(0);
    }).catch((err) => {
      console.error('Error closing connection to mongodb: ', err);
      process.exit(1);
    });
})