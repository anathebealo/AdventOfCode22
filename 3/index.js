const data = require('./data.json');
const datatest = require('./datatest.json');

// part 1
let score = 0;
data.forEach(pack => {
  const result = [pack.slice(0, pack.length/2), pack.slice(pack.length/2)];
  const lettersFound = {};
  let duplicatedLetter = '';
  for(let i = 0; i<result[0].length; i++) {
    lettersFound[result[0].charAt(i)] = 0;
  }

  for(let i = 0; i<result[1].length; i++) {
    if(lettersFound[result[1].charAt(i)] !== undefined) {
      duplicatedLetter = result[1].charAt(i);
    }
  }

  if(duplicatedLetter.charCodeAt(0) < 97) {
    score += duplicatedLetter.charCodeAt(0) - 38;
  } else {
    score += duplicatedLetter.charCodeAt(0) - 96;
  }
});

console.log('part 1: ', score);


// part 2
let score2 = 0;
for(let j = 0; j<data.length; j+=3) {
  let duplicateLetter = '';
  const lettersFound2 = {};
  const packs = [data[j], data[j+1], data[j+2]];
    
  for(let i = 0; i<packs[0].length; i++) {
    lettersFound2[packs[0].charAt(i)] = 0;
  }
  for(let i = 0; i<packs[1].length; i++) {
    if(lettersFound2[packs[1].charAt(i)] !== undefined) {
      lettersFound2[packs[1].charAt(i)] = 1;
    }
  }
  for(let i = 0; i<packs[2].length; i++) {
    if(lettersFound2[packs[2].charAt(i)] === 1) {
      duplicateLetter = packs[2].charAt(i);
    }
  }

  if(duplicateLetter.charCodeAt(0) < 97) {
    score2 += duplicateLetter.charCodeAt(0) - 38;
  } else {
    score2 += duplicateLetter.charCodeAt(0) - 96;
  }
}

console.log('part 2: ', score2);
