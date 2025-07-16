const mongoose = require('mongoose');
const cryptoUtils = require('./utils/cryptoUtils');
const User = require('./models/user');
const config = require('./config');
const faker = require('faker'); // generates fake usernames, emails and passwords

// Function to generate random user data
function generateRandomUser() {
  const salt = cryptoUtils.generateRandomSalt();
  const password = faker.internet.password();
  const hash = cryptoUtils.hash(password, salt);

  return {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    hash: hash,
    salt: salt,
    password: password
  };
}

async function populateDatabase(verbose = false) {
  const numEntries = parseInt(process.argv[2], 10) || 10; // Get the number of entries from the command-line argument or default to 10
  try {
    // Establish MongoDB connection
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Generate random users
    const users = Array.from({length: numEntries}, () => generateRandomUser()); // Generate `numEntries` random users

    // Insert generated entries into the database
    await User.insertMany(users);

    console.log(`Database populated with ${numEntries} random users.`);
  } catch (error) {
    if(verbose) console.error('Error populating the database:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// Call the function to populate the database
//populateDatabase();
