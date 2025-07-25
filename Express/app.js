const express = require('express');
const app = express();
const mongoose = require("mongoose");
const config = require('./config');
const port = config.port;
mongoose.set('strictQuery', false);




app.use(express.json());

app.use("/auth", require("./routes/login"));
app.use("/signup", require("./routes/signup"));
app.use("/user", require("./routes/user"));
app.use("/note", require("./routes/note"));
app.use("/event", require("./routes/event"));
app.use("/pomodoro", require("./routes/pomodoro"));
app.use("/notification", require("./routes/notification"));

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