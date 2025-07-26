const express = require('express');
const app = express();
const mongoose = require("mongoose");
//const config = require('./config');
mongoose.set('strictQuery', false);

app.use(express.json());

app.use("/auth", require("./routes/login"));
app.use("/signup", require("./routes/signup"));
app.use("/user", require("./routes/user"));
app.use("/note", require("./routes/note"));
app.use("/event", require("./routes/event"));
app.use("/pomodoro", require("./routes/pomodoro"));
app.use("/activity", require('./routes/activity'));

const os = require('os');

const mongoCredentials = {
	user: "site242536",
	pwd: "nee0Eiwu",
	site: "mongo_site242536"
}

let mongouri;
let port;

function getURI(credentials) {
	const username = os.userInfo().username;
	
//if it contains a dot i assume we are in a laboratory machine otherwise in localhost
	if (username.includes('.')) {
		// Do something if the username contains a dot
		console.log("Username contains a dot:", username);
		mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}/selfie`;
		port = 8000;

		// Path to Angular build output
		const angularPath = path.join(__dirname, '../Angular/dist/angular/browser');
		app.use(express.static(angularPath));

		app.get('*', (req, res) => {
			res.sendFile(path.join(angularPath, 'index.html'));
		});  
	} else {
		console.log("Username does not contain a dot:", username);
		mongouri = 'mongodb://localhost:27017/selfie';
		port = 3002;
	}
}
getURI(mongoCredentials);

mongoose.connect(mongouri, {
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
