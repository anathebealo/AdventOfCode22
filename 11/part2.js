const data = require('./data.json');
const datatest = require('./datatest.json');

class ModNumber {
  constructor(startingNumber) {
    this.mods = {
      2: startingNumber%2,
      3: startingNumber%3,
      5: startingNumber%5,
      7: startingNumber%7,
      11: startingNumber%11,
      13: startingNumber%13,
      17: startingNumber%17,
      19: startingNumber%19,
      23: startingNumber%23,
    };
  }

  isNumberDivisibleByX = (x) => {
    if(this.mods[x] !== undefined) {
      return this.mods[x] === 0;
    } else {
      return false;
    }
  }

  add = (num) => {
    Object.keys(this.mods).forEach(prime => {
      this.mods[prime] = (parseInt(this.mods[prime]) + parseInt(num)) % parseInt(prime);
    });
  }

  multiply = (num) => {
    Object.keys(this.mods).forEach(prime => {
      this.mods[prime] = (parseInt(this.mods[prime]) * parseInt(num)) % parseInt(prime);
    });
  }

  square = () => {
    Object.keys(this.mods).forEach(prime => {
      this.mods[prime] = (parseInt(this.mods[prime]) * parseInt(this.mods[prime])) % parseInt(prime);
    });

  }
}

class Monkey {
  constructor({ startingItems, operation, test}) {
    this.startingItems = startingItems.map(x => new ModNumber(x));
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

    switch(operationSplit[1]) {
      case '+':
        return item.add(operationSplit[2]);
      case '*':
        if(operationSplit[2] === 'old') {
          return item.square();
        }
        return item.multiply(operationSplit[2]);
      default: 
        break;
    }
  }

  whoToPassTo (worryLevel) {
    if(worryLevel.isNumberDivisibleByX(this.test.divisibleBy)) {
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
Object.keys(data).forEach(monkey => {
  monkeys[monkey] = new Monkey(data[monkey]);
});


let round = 1;
while(round <= 10000) {
  for(const monkeyIndex in monkeys) {
    const monkey = monkeys[monkeyIndex];

    const numberOfItems = monkey.getNumberOfItems();
    for(let i = 0; i<numberOfItems; i++) {
      const item = monkey.getFirstItem();
      monkey.inspectItem(item);
      const whoToPassTo = monkey.whoToPassTo(item);

      monkeys[whoToPassTo].addItem(item);
    }
  }

  if(round % 1000 === 0 || round === 1 || round === 20) {
    console.log('After Round ' + round);
    printMonkeyInspections(monkeys);
  }
  round++;
}

let counts = [];
for(const monkeyIndex in monkeys) {
  const monkey = monkeys[monkeyIndex];
  counts.push(parseInt(monkey.getInspectionCount()));
}

counts = counts.sort((a, b) => b-a);
console.log('Monkey Business: ' + counts[0]*counts[1]);