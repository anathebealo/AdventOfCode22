const datatest = require('./datatest.json');
const data = require('./data.json');

const FALSEY = -1;
const TRUEY = 1;
const UNKNOWN = 0;
const debug = false;


const compareTwoIntegers = (left, right) => {
  debug && console.log(`Compare ${left} vs ${right}`);
  if(right < left) {
    return FALSEY;
  } else if(left < right) {
    return TRUEY;
  } else {
    return UNKNOWN;
  }
}

const comparePair = (left, right) => {
  debug && console.log(`Compare ${JSON.stringify(left)} vs ${JSON.stringify(right)}`);
  for(let leftIndex = 0; leftIndex < left.length; leftIndex++) {
    if(right.length > leftIndex) {
      const leftItem = left[leftIndex];
      const rightItem = right[leftIndex];

      if(typeof leftItem === 'number' && typeof rightItem === 'number' ) {
        const numberCompare = compareTwoIntegers(leftItem, rightItem);
        if(numberCompare === FALSEY) {
          debug && console.log('Right side is smaller, so inputs are NOT in the right order');
          return FALSEY;
        } else if(numberCompare === TRUEY) {
          debug && console.log('Left side is smaller, so inputs are in the right order');
          return TRUEY;
        }
      } else if(typeof leftItem === 'object' && typeof rightItem === 'object') {
        const arrayCompare = comparePair(leftItem, rightItem);
        if(arrayCompare === FALSEY) {
          return FALSEY;
        } else if(arrayCompare === TRUEY) {
          return TRUEY;
        }
      } else if(typeof leftItem === 'number') {
        debug && console.log(`Compare ${JSON.stringify(leftItem)} vs ${JSON.stringify(rightItem)}`);
        debug && console.log(`Mixed types; convert left to [${leftItem}] and retry comparison`);
        const arrayCompare = comparePair([leftItem], rightItem);
        if(arrayCompare === FALSEY) {
          return FALSEY;
        } else if(arrayCompare === TRUEY) {
          return TRUEY;
        }
      } else if(typeof rightItem === 'number') {
        debug && console.log(`Compare ${JSON.stringify(leftItem)} vs ${JSON.stringify(rightItem)}`);
        debug && console.log(`Mixed types; convert right to [${rightItem}] and retry comparison`);
        const arrayCompare = comparePair(leftItem, [rightItem]);
        if(arrayCompare === FALSEY) {
          return FALSEY;
        } else if(arrayCompare === TRUEY) {
          return TRUEY;
        }
      }
    } else {
      // case where right array is smaller than left array
      debug && console.log('Right side ran out of items, so inputs are not in the right order');
      return FALSEY;
    }
  }

  if(left.length < right.length) {
    debug && console.log('Left side ran out of items, so inputs are in the right order');
    return TRUEY;
  }

  debug && console.log(`Returning unknown - end of left input ${JSON.stringify(left)} vs ${JSON.stringify(right)}`);
  return UNKNOWN;
}

const inputData = data;

let index = 1;
let indexSum = 0;
let correctIndices = [];
for(let i = 0; i<inputData.length; i+=2) {
  let left = inputData[i];
  let right = inputData[i+1];
  debug && console.log();
  debug && console.log(`== Pair ${index} == `)
  const comparePairs = comparePair(left, right);
  
  if(comparePairs === TRUEY) {
    correctIndices.push(index);
    indexSum += index;
  }

  index++;
}
debug && console.log(correctIndices);
console.log('Part 1: ' + indexSum);

inputData.push([[2]]);
inputData.push([[6]]);
inputData.sort((a,b) => {
  const comparePairs = comparePair(a, b);
  if(comparePairs === TRUEY) {
    return -1;
  } else if(comparePairs === FALSEY) {
    return 1;
  } else if(comparePairs === UNKNOWN) {
    return 0;
  } else {
    debug && console.log('no return value found');
    return 0;
  }
});

debug && console.log(inputData);
let indexProduct = 1;
inputData.forEach((item, i) => {
  if(JSON.stringify(item) === JSON.stringify([[2]]) || JSON.stringify(item) === JSON.stringify([[6]])) {
    indexProduct *=  (i+1);
  }
});
console.log('Part 2: ' + indexProduct);
