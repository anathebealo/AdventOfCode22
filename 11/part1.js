const data = require('./data.json');
const datatest = require('./datatest.json');

const getPrimeFactors = (n) => {
  const factors = [];
  let divisor = 2;

  while (n >= 2) {
    if (n % divisor == 0) {
      factors.push(divisor);
      n = n / divisor;
    } else {
      divisor++;
    }
  }
  return factors;
}

class Monkey {
  constructor({ startingItems, operation, test}) {
    this.startingItems = startingItems;
    this.operation = operation;
    this.test = test;
    this.inspectionCount = 0;
  }

  getInspectionCount = () => {
    return this.inspectionCount;
  }

  getItems = () => {
    return this.startingItems;
  }

  getNumberOfItems = () => {
    return this.startingItems.length;
  }

  addItem = (item) => {
    this.startingItems.push(item);
  }

  getFirstItem = () => {
    return this.startingItems.shift();
  }

  increaseItemCount = () => {
    this.inspectionCount += 1;
  }

  inspectItem = (item) => {
    this.increaseItemCount();

    const operationSplit = this.operation.split(' ');
    const firstVal = operationSplit[0] === 'old' ? parseInt(item) : parseInt(operationSplit[0]);
    const lastVal =  operationSplit[2] === 'old' ? parseInt(item) : parseInt(operationSplit[2]);
    
    switch(operationSplit[1]) {
      case '+': 
        return parseInt(firstVal) + parseInt(lastVal);
      case '*': 
        return parseInt(firstVal) * parseInt(lastVal);
      case '-':
          return parseInt(firstVal) - parseInt(lastVal);
      case '/': 
        return parseInt(firstVal) / parseInt(lastVal);
      default: 
        break;
    }
  }

  getBored = (item) => {
    return Math.floor(parseInt(item)/3);
  }

  whoToPassTo (worryLevel) {
    if(worryLevel % this.test.divisibleBy === 0) {
      return this.test.ifTrue;
    } else {
      return this.test.ifFalse;
    }
  }
}

const printMonkeyInspections = (monkeys) => {
  for(const monkey in monkeys) {
    console.log(`Monkey ${monkey} inspected items ${monkeys[monkey].getInspectionCount()} times.`);
  }
  console.log('');
}

const printMoneyHoldings = (monkeys) => {
  for(const monkey in monkeys) {
    console.log(`Monkey ${monkey}: ${monkeys[monkey].getItems().join(', ')}`);
  }
  console.log('');
}

const monkeys = {};
Object.keys(datatest).forEach(monkey => {
  monkeys[monkey] = new Monkey(datatest[monkey]);
});


let round = 1;
while(round <= 20) {
  for(const monkeyIndex in monkeys) {
    const monkey = monkeys[monkeyIndex];

    const numberOfItems = monkey.getNumberOfItems();
    for(let i = 0; i<numberOfItems; i++) {
      const originalItem = monkey.getFirstItem();
      const worryIncrease = monkey.inspectItem(originalItem);
      const worryDecrease = monkey.getBored(worryIncrease);
      const whoToPassTo = monkey.whoToPassTo(worryDecrease);

      monkeys[whoToPassTo].addItem(worryDecrease);
    }
  }

  // console.log('After Round ' + round);
  // printMonkeyInspections(monkeys);
  round++;
}

let counts = [];
for(const monkeyIndex in monkeys) {
  const monkey = monkeys[monkeyIndex];
  counts.push(parseInt(monkey.getInspectionCount()));
}

counts = counts.sort((a, b) => b-a);
console.log('Monkey Business: ' + counts[0]*counts[1]);