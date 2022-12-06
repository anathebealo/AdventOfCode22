const data = require('./data.json');

// Question 1
let max = 0;
data.forEach(elf => {
  let sum = 0;
  elf.forEach(item => {
    sum += item;
  });
  if(sum > max) {
    max = sum;
  }
});

console.log(max);

// Question 2
let max1 = 0;
let max2 = 0;
let max3 = 0;

data.forEach(elf => {
  let sum = 0;
  elf.forEach(item => {
    sum += item;
  });
  if(sum > max3) {
    if(sum > max2) {
      if(sum > max1) {
        max3 = max2;
        max2 = max1;
        max1 = sum;
      } else {
        max3 = max2;
        max2 = sum;
      }
    } else {
      max3 = sum;
    }
  }
});

console.log(max1 + max2 + max3);