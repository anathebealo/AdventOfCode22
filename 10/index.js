const fs = require('node:fs');
const readline = require('node:readline');
const path = require('path');

const NOOP = 'noop';
const ADD = 'addx';

const rl = readline.createInterface({
  input: fs.createReadStream(path.join(__dirname, 'data.txt')),
  crlfDelay: Infinity,
});

const instructions = [];
rl.on('line', (line) => {
  const split = line.split(' ');
  if(split[0] === NOOP) {
    instructions.push({ type: NOOP });
  } else {
    instructions.push({ type: ADD, amount: parseInt(split[1]) });
  }
}).on('close', () => {
  let done = false;
  let signals = [];

  let cycleCount = 0;
  let x = 1;
  let instructionPointer = 0;
  
  let waitingForAdd = false;
  let addCycle = 0;
  let pixels = [];

  while(!done) {
    // each tick of while loop is a cycle
    //  ----------------- START CYCLE ----------------------------------
    cycleCount += 1;
    let addThisCycle = false;
    if(!waitingForAdd) {
      let instruction = instructions[instructionPointer];
      if(instruction.type === ADD) {
        waitingForAdd = true;
        addCycle = cycleCount;
      }
    } else {
      if(cycleCount - addCycle === 1) {
        addThisCycle = true;
      }
    }
    // ----------------- DURING CYCLE ----------------------------------
    if(cycleCount === 20 || (cycleCount - 20)%40 === 0) {
      signals.push(cycleCount * x);
    }

    // check drawing
    if((cycleCount-1)%40 >= x - 1 && (cycleCount-1)%40 <= x+1) {
      pixels.push('#');
    } else {
      pixels.push(' ');
    }
    
    //  ------------------ AFTER CYCLE ----------------------------------
    if(addThisCycle) {
      x += instructions[instructionPointer].amount;
      instructionPointer += 1;
      waitingForAdd = false;
    } else if(!waitingForAdd) {
      instructionPointer += 1;
    }

    if(instructionPointer >= instructions.length) {
      done = true;
    }
  }
  
  // part 1
  let sum = 0;
  signals.forEach(signal => {
    sum += parseInt(signal);
  });
  console.log('part 1 - ', sum);

  // part 2
  console.log('part 2: ');
  for(let j = 0; j<6; j++) {
    let string = '';
    for(let i = 0; i<40; i++) {
      string = string + pixels[40*j + i];
    }
    console.log(string);
  }
});