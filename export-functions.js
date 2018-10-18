function generateRandomString() {
  let output = '';
  const letAndNum = 'abcdefghijklmnopqrstuvwxyz0123456789';

  for(let i = 0; i < 7; i++){
    output += letAndNum.charAt(Math.random() * letAndNum.length);
  }
  return output;
}

function bordaCount(optionArray) {

  for (i = 0; i < optionArray.length; i++) {
    let numberItems = optionArray.length;
    let bordaScore = optionArray.length - i;
    knex('option').where(optionArray[i], 'like', 'text').increment({'vote': bordaScore});
  }
};

module.exports = {
  generateRandomString,
  bordaCount,
};
