const fs = require('node:fs');
const readline = require('node:readline');
const path = require('path');

const fileToUse = 'data.txt';
const rl = readline.createInterface({
  input: fs.createReadStream(path.join(__dirname, fileToUse)),
  crlfDelay: Infinity,
});

const printCavern = (cavern) => {
  cavern.forEach(row => {
    // data console
    console.log(row.slice(300,670).join(''));
    // datatest console
    //console.log(row.slice(490,510).join(''));
  });
}

const paths = [];
const cavern = [];
for(let i = 0; i<170; i++) { // data = 170, datatest = 15
  const row = [];
  for(let j = 0; j<950; j++) { // data = 950, datatest = 510
    row.push('.');
  }
  cavern.push(row);
}
rl.on('line', (line) => {
  const rockPathArrays = line.split(' -> ').map(x => x.split(','));
  const rockPath = rockPathArrays.map(x => { return { x: x[0], y: x[1] }});
  paths.push(rockPath);
}).on('close', () => {
  let minX = 600;
  let minY = 600;
  let maxX = 0;
  let maxY = 0;
  for(let index = 0; index<paths.length; index++) {
    const currentPath = paths[index];
    for(let i = 0; i<currentPath.length - 1; i++) {
      const a = currentPath[i];
      const b = currentPath[i+1];
      minX = Math.min(Math.min(a.x, b.x), minX);
      minY = Math.min(Math.min(a.y, b.y), minY);
      maxX = Math.max(Math.max(a.x, b.x), maxX);
      maxY = Math.max(Math.max(a.y, b.y), maxY);

      if(a.x === b.x && a.y !== b.y) {
        for(let j = 0; j<=Math.abs(a.y - b.y); j++) {
          cavern[Math.min(a.y, b.y) + j][a.x] = '#';
        }
      } else if(a.y === b.y && a.x !== b.x) {
        for(let j = 0; j<=Math.abs(a.x - b.x); j++) {
          cavern[a.y][Math.min(a.x, b.x) + j] = '#';
        }
      }
    }
  }
  console.log(minX, maxX, minY, maxY);

  for(let i = 0; i<cavern.length; i++) {
    for(let j = 0; j<cavern[i].length; j++) {
      if(i === maxY + 2) {
        cavern[i][j] = '#';
      }
    }
  }

  cavern[0][500] = '+';

  const overflowYPosition = 165; // data = 165, datatest = 12
  let sandOverflowing = false;
  let unitsOfSand = 0;
  while(!sandOverflowing) {
    let sandAtRest = false;
    const sandLocation = {x: 500, y: 0};
    while(!sandAtRest) {
      // if(sandLocation.y >= overflowYPosition) {
      //   sandAtRest = true;
      //   sandOverflowing = true;
      // }
      //console.log(cavern.length, cavern[0].length, sandLocation.x, sandLocation.y + 1);
      if(cavern[sandLocation.y + 1][sandLocation.x] === '.') {
        // drop sand down one
        sandLocation.y = sandLocation.y + 1;
      } else if(cavern[sandLocation.y + 1][sandLocation.x - 1] === '.') {
        // drop sand diagonally left
        sandLocation.y = sandLocation.y + 1;
        sandLocation.x = sandLocation.x - 1;
      } else if(cavern[sandLocation.y + 1][sandLocation.x + 1] === '.') {
        // drop sand diagonally right
        sandLocation.y = sandLocation.y + 1;
        sandLocation.x = sandLocation.x + 1;
      } else {
        if(sandLocation.y === 0 && sandLocation.x === 500) {
          sandAtRest = true;
          sandOverflowing = true;
          unitsOfSand++;
          cavern[sandLocation.y][sandLocation.x] = 'o';
        }
        sandAtRest = true;
        unitsOfSand++;
        cavern[sandLocation.y][sandLocation.x] = 'o';
      }
    }
  }
  printCavern(cavern);
  console.log(unitsOfSand);
});