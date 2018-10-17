// generate random string for unique URL to share?
function generateRandomString() {
var randomString = '';
const possibleChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
  for (let i = 0; i < 6; i++) {
  randomString += possibleChars[getRandomInt(0, 61)];
  };
  return randomString;
}

module.exports = {
  generateRandomString,
};
