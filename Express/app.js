const express = require('express');
const app = express();
const port = 3002;
const login = require('./modules/login');
const signup = require('./modules/signup');
const mongoose = require("mongoose");
const config = require('./config');

app.use(express.json());

app.use("/auth", login);
app.use("/signup", signup);

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