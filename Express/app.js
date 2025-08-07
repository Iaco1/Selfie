const environment = require('./environment');
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require("mongoose");
const {mongoURI, options, port} = require('./config')(environment.remote);
mongoose.set('strictQuery', false);

const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,
}
app.use(cors(corsOptions));



app.use(express.json());

app.use("/auth", require("./routes/login"));
app.use("/signup", require("./routes/signup"));
app.use("/user", require("./routes/user"));
app.use("/note", require("./routes/note"));
app.use("/event", require("./routes/event"));
app.use("/pomodoro", require("./routes/pomodoro"));
app.use("/activity", require('./routes/activity'));


// Serve static files from the Angular build directory
const staticPath = path.join(__dirname, '/dist/angular/browser');
console.log('Serving static files from:', staticPath);

// Serve static files
app.use(express.static(path.join(staticPath)));

// Handle all other routes and return the Angular index.html file
app.use((req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

mongoose.connect(mongoURI, options).then(() => {
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
