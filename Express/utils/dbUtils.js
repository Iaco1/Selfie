const User = require("../models/User");
const cryptoUtils = require("./cryptoUtils");

async function getUsers(verbose = false) {
  try {
    // Fetch the documents and assign them to userCollection
    const userCollection = await User.find({});
    if (verbose) console.log("successful fetching of: ", userCollection); // Logs the array of documents
    return userCollection;
  } catch (err) {
    console.error('Error fetching userCollection:', err);
  }
}

function getUserByEmail(userCollection, email) {
  return userCollection.find(u => u.email === email);
}

function getUserByUsername(userCollection, username) {
  return userCollection.find(u => u.username === username);
}

async function insertUser(user) {
  try{
    user.salt = cryptoUtils.generateRandomSalt();
    user.hash = cryptoUtils.hash(user.password, user.salt);

    await User.insertOne(user);
  }catch(error){
    if(error.code === 11000){
      console.log("Duplicate entry detected:", error.message);
    }else{
      console.error('Error inserting user:', error);
    }
  }
}

module.exports = {
  getUsers,
  insertUser,
  getUserByEmail,
  getUserByUsername
};