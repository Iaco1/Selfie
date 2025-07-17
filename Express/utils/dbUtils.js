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

function getUserById(userCollection, id) {
  return userCollection.find(u => u.id === id);
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

async function deleteUser(token) {
  console.log("attempting deletion of: ", token);
  const result = await User.deleteOne({_id: token});
  if (result.deletedCount === 0) throw new Error("no user deleted");
  else console.log(" deletion successful");
}

async function updateUser(token, userData) {
  console.log("attempting update of: ", token);

  if(userData.password){
    return changePassword(token, userData.password);
  }

  let updated = false;

  const result = await User.updateOne({_id: token}, {$set: userData});

  if(!result.acknowledged){
    console.log(" no update took place");
    throw new Error("no update took place");
  }
}

async function changePassword(token, newPassword) {
  console.log("attempting password change of: ", token);
  const salt = cryptoUtils.generateRandomSalt();
  const hash = cryptoUtils.hash(newPassword, salt);

  await User.updateOne(
    { _id: token },
    { $set: { hash: hash, salt: salt, password: newPassword } }).then(result => {
      if(!result.acknowledged){
        console.log(" no update took place");
        throw new Error("no update took place");
      }else {
        console.log(" password change successful");
      }
  })

}
module.exports = {
  getUsers,
  insertUser,
  getUserByEmail,
  getUserByUsername,
  deleteUser,
  updateUser,
  getUserById
};