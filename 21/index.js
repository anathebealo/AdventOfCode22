const fs = require('node:fs');
const readline = require('node:readline');
const { performance } = require('perf_hooks');
const path = require('path');

const dataFile = {
  name: 'data.txt',

};

const dataTestFile =  {
  name: 'datatest.txt',
}

const fileToUse = dataFile;

const rl = readline.createInterface({
  input: fs.createReadStream(path.join(__dirname, fileToUse.name)),
  crlfDelay: Infinity,
});

const monkeys = {};
rl.on('line', (line) => {
  const lineSplit = line.split(': ');
  const name = lineSplit[0];
  if(!monkeys[name]) {
    monkeys[name] = { listeners: []};
  }

  if(lineSplit[1].length < 6) {
    monkeys[name].value = parseInt(lineSplit[1]);
  } else {
    const monkey1 = lineSplit[1].substring(0,4);
    const operator = lineSplit[1].substring(4,6).trim();
    const monkey2 = lineSplit[1].substring(7, 11);
    monkeys[name] = { ...monkeys[name],
      monkey1, operator, monkey2
    };
  }
}).on('close', () => {
  console.log(monkeys);
  Object.keys(monkeys).forEach(monkeyName => {
    if(monkeys[monkeyName].monkey1 !== undefined) {
      monkeys[monkeys[monkeyName].monkey1].listeners.push(monkeyName);
    }

    if(monkeys[monkeyName].monkey2 !== undefined) {
      monkeys[monkeys[monkeyName].monkey2].listeners.push(monkeyName);
    }
  });

  const monkeyCopy = JSON.parse(JSON.stringify(monkeys));

  const areAllMonkeysSolved = (monkeys) => {
    let monkeysDone = true;
    Object.keys(monkeys).forEach(monkeyName => {
      if(monkeys[monkeyName].value === undefined) {
        monkeysDone = false;
      }
    });
    return monkeysDone;
  }

  const updateMonkeys = (monkeys) => {
    let changedAMonkey = false;
    Object.keys(monkeys).forEach(monkeyName => {
      const monkey = monkeys[monkeyName];
      if(monkey.value !== undefined) {
        monkey.listeners.forEach(listener => {
          if(monkeys[listener].monkey1 === monkeyName) {
            monkeys[listener].monkey1 = parseInt(monkey.value);
            changedAMonkey = true;
          } else if(monkeys[listener].monkey2 === monkeyName) {
            monkeys[listener].monkey2 = parseInt(monkey.value);
            changedAMonkey = true;
          }

          if(parseInt(monkeys[listener].monkey1) && parseInt(monkeys[listener].monkey2)) {
            monkeys[listener] = { 
              listeners: monkeys[listener].listeners, 
              value: eval(`${monkeys[listener].monkey1} ${monkeys[listener].operator} ${monkeys[listener].monkey2}`)
            };
            changedAMonkey = true;
          }
        })
      }
    });
    return changedAMonkey;
  }

  // PART 1
  let allMonkeysHaveCalls = false;
  let index = 0;
  while(!allMonkeysHaveCalls) {
    updateMonkeys(monkeys);

    if(areAllMonkeysSolved(monkeys)) {
      allMonkeysHaveCalls = true;
    }
    index++;
  }

  console.log("Part 1: " + monkeys.root.value);

  // PART 2
  delete monkeyCopy.humn;

  let monkeysAllUpdated = false;
  while(!monkeysAllUpdated) {
    monkeysAllUpdated = !updateMonkeys(monkeyCopy);
  }

  console.log(monkeyCopy);

  const reduceSet = (monkeys) => {
    let monkeysUnDone = {};
    Object.keys(monkeys).forEach(monkeyName => {
      if(monkeys[monkeyName].value === undefined) {
        monkeysUnDone[monkeyName] = { ... monkeys[monkeyName]};
      }
    });
    return monkeysUnDone;
  }
  console.log(reduceSet(monkeyCopy));

  let notFinished = true;
  let monkeyName = parseInt(monkeyCopy.root.monkey1) ? monkeyCopy.root.monkey2 : monkeyCopy.root.monkey1;  
  let value = parseInt(monkeyCopy.root.monkey1) || parseInt(monkeyCopy.root.monkey2);
  console.log(monkeyName, value);
  while(notFinished) {
    let newMonkeyName = parseInt(monkeyCopy[monkeyName].monkey1) ? monkeyCopy[monkeyName].monkey2 : monkeyCopy[monkeyName].monkey1;  
    let solveForMonkey1 = parseInt(monkeyCopy[monkeyName].monkey1) ? false : true;
    let newValue = 0;

    switch(monkeyCopy[monkeyName].operator) {
      case '+':
        console.log(`${monkeyName} = ${monkeyCopy[monkeyName].monkey1} - ${monkeyCopy[monkeyName].monkey2}`);
        console.log(solveForMonkey1 ? `${monkeyName} = ${value} - ${monkeyCopy[monkeyName].monkey2}` : `${newMonkeyName} = ${monkeyCopy[monkeyName].monkey1} - ${value}`)
        
        if(solveForMonkey1) {
          // monkey1: 'cczh', operator: '+', monkey2: 4 }
          // value = cczh + monkey2 ...... cczh = value - monkey2
          newValue = eval(`${value} - ${monkeyCopy[monkeyName].monkey2}`);
        } else {
          // monkey1: 4, operator: '+', monkey2: 'cczh' }
          // value = monkey1 + cczh .... cczh = value - monkey1
          newValue = eval(`${value} - ${monkeyCopy[monkeyName].monkey1}`);
        }
        monkeyCopy[monkeyName] = { 
          ...monkeyCopy[monkeyName],
          value: newValue
        };
        break;
      case '-':
        console.log(`${monkeyName} = ${monkeyCopy[monkeyName].monkey1} + ${monkeyCopy[monkeyName].monkey2}`);
        console.log(solveForMonkey1 ? `${monkeyName} = ${value} + ${monkeyCopy[monkeyName].monkey2}` : `${newMonkeyName} = ${monkeyCopy[monkeyName].monkey1} + ${value}`)
        
        if(solveForMonkey1) {
          // monkey1: 'cczh', operator: '-', monkey2: 4 }
          // value = cczh - monkey2 ...... cczh = value + monkey2
          newValue = eval(`${value} + ${monkeyCopy[monkeyName].monkey2}`);
        } else {
          // monkey1: 4, operator: '-', monkey2: 'cczh' }
          // value = monkey1 - cczh .... cczh = monkey1 - value
          newValue = eval(`${monkeyCopy[monkeyName].monkey1} - ${value}`);
        }
        monkeyCopy[monkeyName] = { 
          ...monkeyCopy[monkeyName],
          value: newValue
        };
        break;
      case '*':
        console.log(`${monkeyName} = ${monkeyCopy[monkeyName].monkey1} / ${monkeyCopy[monkeyName].monkey2}`);
        console.log(solveForMonkey1 ? `${monkeyName} = ${value} / ${monkeyCopy[monkeyName].monkey2}` : `${newMonkeyName} = ${monkeyCopy[monkeyName].monkey1} / ${value}`)

        if(solveForMonkey1) {
          // monkey1: 'cczh', operator: '*', monkey2: 4 }
          // value = cczh * monkey2 ...... cczh = value / monkey2
          newValue = eval(`${value} / ${monkeyCopy[monkeyName].monkey2}`);
        } else {
          // monkey1: 4, operator: '*', monkey2: 'cczh' }
          // value = monkey1 * cczh .... cczh = value / monkey1
          newValue = eval(`${value} / ${monkeyCopy[monkeyName].monkey1}`);
        }
        monkeyCopy[monkeyName] = { 
          ...monkeyCopy[monkeyName],
          value: newValue
        };
        break;
      case '/':
        console.log(`${monkeyName} = ${monkeyCopy[monkeyName].monkey1} * ${monkeyCopy[monkeyName].monkey2}`);
        console.log(solveForMonkey1 ? `${monkeyName} = ${value} * ${monkeyCopy[monkeyName].monkey2}` : `${newMonkeyName} = ${monkeyCopy[monkeyName].monkey1} * ${value}`)

        if(solveForMonkey1) {
          // monkey1: 'cczh', operator: '/', monkey2: 4 }
          // value = cczh / monkey2 ...... cczh = value * monkey2
          newValue = eval(`${value} * ${monkeyCopy[monkeyName].monkey2}`);
        } else {
          // monkey1: 4, operator: '/', monkey2: 'cczh' }
          // value = monkey1 / cczh .... cczh = monkey1 / value
          newValue = eval(`${monkeyCopy[monkeyName].monkey1} / ${value}`);
        }
        monkeyCopy[monkeyName] = { 
          ...monkeyCopy[monkeyName],
          value: newValue
        };
        break;
    }
    // console.log(monkeyCopy[monkeyName]);

    value = newValue;
    monkeyName = newMonkeyName;
    console.log(monkeyName, value);
    if(monkeyName === 'humn') {
      notFinished = false;
      console.log("Part 2: " + value);
    }
    // notFinished = false;
  }
});