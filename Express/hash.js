const populatedb = require('./populatedb');
const cryptoUtils = require('./cryptoUtils');

// Define a password and an optional salt
const password = process.argv[2]; // Password passed as a command-line argument
if (!password) {
  console.error("Please provide a password as a command-line argument.");
  process.exit(1);
}
const salt = cryptoUtils.generateRandomSalt(); // Optional; if omitted, the library will generate one

const hash = cryptoUtils.hash(password, salt);
console.log("hash: ", hash);
console.log("salt: ", salt);
