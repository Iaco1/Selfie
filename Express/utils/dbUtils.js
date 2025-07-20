const User = require("../models/User");
const cryptoUtils = require("./cryptoUtils");
const Pomodoro = require("../models/Pomodoro");


// USERS
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

async function getUserByUsername(username) {
  try{
    return await User.findOne({username: username});
  }catch (err){
    console.log("user fetch failed");
    throw err;
  }
}

async function getUserById(id) {
  try{
    return await User.findOne({_id: id});
  }catch (err){
    console.log("user fetch failed");
    throw err;
  }
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



//POMODOROS

async function overlaps(pomodoro) {
  const Pst = new Date(pomodoro.startTime);
  const Pet = new Date(pomodoro.endTime);
  try{
    const pomodoroCollection = await Pomodoro.find({authorId: pomodoro.authorId});
    return pomodoroCollection.some(p=> {
      const pst = new Date(p.startTime);
      const pet = new Date(p.endTime);
      if(Pst >= pst && Pst <= pet || Pet >= pst && Pet <= pet){
        console.log("overlap detected");
        return true;
      }
      console.log("no overlap detected");
      return false;
    });
  }catch (err){
    throw err;
  }
}

async function insertPomodoro(pomodoro) {
  try{
    if(await overlaps(pomodoro)) return {
      status: 400,
      message: "overlap detected"
    }
    await Pomodoro.insertOne(pomodoro);
    return {
      status: 200,
      message: "insertion successful"
    }
  }catch(err){
    return {
      status: 500,
      message: `error inserting pomodoro: ${err}`
    };
  }
}

async function getPomodoros(authorId, pomodoroId = null) {
  try {
    if(!pomodoroId) return await Pomodoro.find({authorId: authorId});
    else return await Pomodoro.find({authorId: authorId, _id: pomodoroId});
  }catch (err){
    throw err;
  }
}

//async function updatePomodoro(id, pomodoroData) {}

async function deletePomodoro(pomodoroId) {
  try{
    await Pomodoro.deleteOne({_id: pomodoroId});
  }catch (err){
    throw err;
  }
}

async function deleteAllPomodoros(authorId) {
  try{
    await Pomodoro.deleteMany({authorId: authorId});
  }catch (err){
    throw err;
  }
}
module.exports = {
  getUsers,
  insertUser,
  getUserByUsername,
  deleteUser,
  updateUser,
  getUserById,
  getPomodoros,
  insertPomodoro,
  deletePomodoro,
  deleteAllPomodoros
};