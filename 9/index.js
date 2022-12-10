const fs = require('node:fs');
const readline = require('node:readline');
const path = require('path');

const rl = readline.createInterface({
  input: fs.createReadStream(path.join(__dirname, 'data.txt')),
  crlfDelay: Infinity,
});

const stringifyPosition = (pos) => {
  return `${pos.x}, ${pos.y}`;
}

const decodePosition = (positionString) => {
  const [x, y] = positionString.split(', ');
  return { x: parseInt(x), y: parseInt(y) };
}

const printSpots = (spotsVisited) => {
  let minX = 10000, minY = 10000;
  let maxX = 0, maxY = 0;
  const spots = [];
  spotsVisited.forEach(spotString => {
    const spot = decodePosition(spotString);
    maxX = Math.max(maxX, spot.x);
    minX = Math.min(minX, spot.x);

    minY = Math.min(minY, spot.y);
    maxY = Math.max(maxY, spot.y);

    spots.push(spot);
  });

  const xShift = parseInt(0 - minX);
  const yShift = parseInt(0 - minY);
  const spotArray = [];
  for(let i = 0; i<maxY - minY + 3; i++) {
    spotArray.push([]);
    for(let j = 0; j<maxX - minX + 3; j++) {
      spotArray[i].push('.');
    }
  }
  
  spots.forEach(spot => {
    spotArray[parseInt(spot.y + yShift)][parseInt(spot.x + xShift)] = '#';
  });
  for(let i = 0; i<spotArray.length; i++) {
    console.log(spotArray[i].join(''));
  }
}

const printSingleTurnSpots = (spotsVisited, width = 21, height = 26) => {
  const xShift = 11;
  const yShift = 5;
  const spotArray = [];
  for(let i = 0; i<width; i++) {
    spotArray.push([]);
    for(let j = 0; j<height; j++) {
      spotArray[i].push('.');
    }
  }
  
  spotsVisited.forEach((spot, i) => {
    spotArray[parseInt(spot.y + yShift)][parseInt(spot.x + xShift)] = i;
  });
  for(let i = 0; i<spotArray.length; i++) {
    console.log(spotArray[i].join(''));
  }
  console.log('------------------------')
}

const moveSecondKnot = (head_pos, tail_pos) => {
  // if tail position is 2 away from head in one axis and 1 away in another axis
  if(Math.abs(tail_pos.x - head_pos.x) === 2) {
    if(Math.abs(tail_pos.y - head_pos.y) === 1) {
      tail_pos.y = head_pos.y;
      if(tail_pos.x > head_pos.x) { 
        tail_pos.x -= 1;
      } else {
        tail_pos.x += 1;
      }
    } else if(Math.abs(tail_pos.y - head_pos.y) === 0) {
      if(tail_pos.x > head_pos.x) {
        // need to move tail to the left
        tail_pos.x -= 1;
      } else {
        // need to move tail to the right
        tail_pos.x += 1;
      }
    } else if(Math.abs(tail_pos.y - head_pos.y) === 2) {
      if(tail_pos.x > head_pos.x) {
        tail_pos.x -= 1;
      } else if(tail_pos.x < head_pos.x) {
        tail_pos.x += 1;
      }

      if(tail_pos.y > head_pos.y) {
        tail_pos.y -= 1;
      } else if(tail_pos.y < head_pos.y) {
        tail_pos.y += 1;
      }
    } else {
      console.log("error state 1");
      console.log(Math.abs(tail_pos.y - head_pos.y));
    }
  } else if(Math.abs(tail_pos.y - head_pos.y) === 2) {
    if(Math.abs(tail_pos.x - head_pos.x) === 1) {
      tail_pos.x = head_pos.x;
      if(tail_pos.y > head_pos.y) {
        tail_pos.y -= 1;
      } else {
        tail_pos.y += 1;
      }
    } else if(Math.abs(tail_pos.x - head_pos.x) === 0) {
      if(tail_pos.y > head_pos.y) {
        // need to move tail down
        tail_pos.y -= 1;
      } else {
        // need to move tail up
        tail_pos.y += 1;
      }
    } else if(Math.abs(tail_pos.x - head_pos.x) === 2) {
      if(tail_pos.x > head_pos.x) {
        tail_pos.x -= 1;
      } else if(tail_pos.x < head_pos.x) {
        tail_pos.x += 1;
      }

      if(tail_pos.y > head_pos.y) {
        tail_pos.y -= 1;
      } else if(tail_pos.y < head_pos.y) {
        tail_pos.y += 1;
      }
    } else {
      console.log("error state 2");
    }
  } else if(Math.abs(tail_pos.y - head_pos.y) <= 1 || Math.abs(tail_pos.x - head_pos.x) <= 1) {
    // do nothing
  } else {
    console.log("error state 3")
  }
}

const moveFirstKnot = (head_pos, direction) => {
  switch(direction) {
    case 'U':
      head_pos.y += 1;
      break;
    case 'D':
      head_pos.y -= 1;
      break;
    case 'R': 
      head_pos.x += 1;
      break;
    case 'L':
      head_pos.x -= 1;
      break;
    default: 
      break;
  }
}

const startingPosition = { x: 0, y: 0 };
const spotsVisited = new Set();
const head_pos = JSON.parse(JSON.stringify(startingPosition));
const tail_pos = JSON.parse(JSON.stringify(startingPosition));

const manySpotsVisited = new Set();
const manyKnotsPositions = [];
for(let i = 0; i<10; i++) {
  manyKnotsPositions.push(JSON.parse(JSON.stringify(startingPosition)));
}

spotsVisited.add(stringifyPosition(tail_pos));
manySpotsVisited.add(stringifyPosition(manyKnotsPositions[manyKnotsPositions.length - 1]));

rl.on('line', (line) => {
  const [direction, spots] = line.split(' ');

  for(let i = 0; i<spots; i++) {
    moveFirstKnot(head_pos, direction);
    moveSecondKnot(head_pos, tail_pos);
    spotsVisited.add(stringifyPosition(tail_pos));
    
    moveFirstKnot(manyKnotsPositions[0], direction);
    for(let k = 0; k<manyKnotsPositions.length - 1; k++) {
      moveSecondKnot(manyKnotsPositions[k], manyKnotsPositions[k+1]);
    }

    manySpotsVisited.add(stringifyPosition(manyKnotsPositions[manyKnotsPositions.length - 1]));
  }

}).on('close', () => {
  console.log('part 1 - spots tail visited ', spotsVisited.size);
  console.log('part 2 - spots last knot visited ', manySpotsVisited.size);
  //printSpots(manySpotsVisited);
});