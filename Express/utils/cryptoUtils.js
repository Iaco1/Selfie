const crypto = require('crypto');

// Function to generate a random alphanumeric string for salt
function generateRandomSalt(length = 16) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let salt = '';
  for (let i = 0; i < length; i++) {
    salt += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return salt;
}
function hash(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
}
module.exports = {
  generateRandomSalt,
  hash
};