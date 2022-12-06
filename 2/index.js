const data = require('./data.json');
const datatest = require('./datatest.json');

// part 1
const you_rock_code = 'X';
const you_paper_code = 'Y';
const you_scissor_code = 'Z';

const them_rock_code = 'A';
const them_paper_code = 'B';
const them_scissor_code = 'C';

const rock_score = 1;
const paper_score = 2;
const scissor_score = 3;

const win_round_score = 6;
const draw_round_score = 3;
const lose_round_score = 0;

const calculateScore = (opponent, you) => {
  let score = 0;

  switch(you) {
    case you_rock_code: 
      score += rock_score;
      if(opponent === them_rock_code) {
        score += draw_round_score;
      } else if(opponent === them_paper_code) {
        score += lose_round_score;
      } else if(opponent === them_scissor_code) {
        score += win_round_score;
      }
      break;
    case you_paper_code: 
      score += paper_score;
      if(opponent === them_rock_code) {
        score += win_round_score;
      } else if(opponent === them_paper_code) {
        score += draw_round_score;
      } else if(opponent === them_scissor_code) {
        score += lose_round_score;
      }
      break;
    case you_scissor_code: 
      score += scissor_score;
      if(opponent === them_rock_code) {
        score += lose_round_score;
      } else if(opponent === them_paper_code) {
        score += win_round_score;
      } else if(opponent === them_scissor_code) {
        score += draw_round_score;
      }
      break;
  }

  return score;
}

let totalScore = 0;
data.forEach(round => {
  totalScore += calculateScore(round.opponent, round.you);
});

console.log('part 1: ', totalScore);

// part 2
const lose_code = 'X';
const draw_code = 'Y';
const win_code = 'Z';

const calculateScore2 = (opponent, outcome) => {
  let score = 0;

  switch(outcome) {
    case lose_code: 
      score += lose_round_score;
      if(opponent === them_rock_code) {
        score += scissor_score;
      } else if(opponent === them_paper_code) {
        score += rock_score;
      } else if(opponent === them_scissor_code) {
        score += paper_score;
      }
      break;
    case draw_code: 
      score += draw_round_score;
      if(opponent === them_rock_code) {
        score += rock_score;
      } else if(opponent === them_paper_code) {
        score += paper_score;
      } else if(opponent === them_scissor_code) {
        score += scissor_score;
      }
      break;
    case win_code: 
      score += win_round_score;
      if(opponent === them_rock_code) {
        score += paper_score;
      } else if(opponent === them_paper_code) {
        score += scissor_score;
      } else if(opponent === them_scissor_code) {
        score += rock_score;
      }
      break;
  }

  return score;
}


let totalScore2 = 0;
data.forEach(round => {
  totalScore2 += calculateScore2(round.opponent, round.you);
});

console.log('part 2: ', totalScore2);