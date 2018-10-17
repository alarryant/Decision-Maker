function generateRandomString() {
  let output = '';
  const letAndNum = 'abcdefghijklmnopqrstuvwxyz0123456789';

  for(let i = 0; i < 7; i++){
    output += letAndNum.charAt(Math.random() * letAndNum.length);
  }
  return output;
}

console.log(generateRandomString());

module.exports = {
  generateRandomString,
};
