const data = require('./data.json');
const datatest = require('./datatest.json');

const checkIsUnique = (substring) => {
  const dict = {};
  let isUnique = true;
  for(let j = 0; j<substring.length; j++) {
    let char = substring[j];
    if(dict[char] !== undefined) {
      isUnique = false;
    } else {
      dict[char] = 1;
    }
  }
  return isUnique;
}

const findMarkerForSubstring = (fullString, sizeOfSubstring) => {
  let markerIndex = -1;
  for(let i = 0; i<fullString.length - sizeOfSubstring; i++) {
    let substring = fullString.substring(i, i+sizeOfSubstring);
    let isUnique = checkIsUnique(fullString.substring(i, i+sizeOfSubstring));
    
    if(isUnique) {
      return i+sizeOfSubstring;
    }
  }

  return 0;
}

// part 1
const part1String = data.input;
console.log('part 1: ', findMarkerForSubstring(part1String, 4));

// testing part 2
console.log('------ TESTING ------ ')
datatest.tests.forEach(test => {
  let testString = test.input;
  console.log(findMarkerForSubstring(testString, 14) === test.answer);
});
console.log('------ END TESTING ------ ')

// part 2
const part2String = data.input;
console.log('part 2: ', findMarkerForSubstring(part2String, 14));
