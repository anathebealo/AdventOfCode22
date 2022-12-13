const fs = require('node:fs');
const {
  PriorityQueue,
} = require('@datastructures-js/priority-queue');
const readline = require('node:readline');
const path = require('path');

const rl = readline.createInterface({
  input: fs.createReadStream(path.join(__dirname, 'data.txt')),
  crlfDelay: Infinity,
});

const canWalkFromAToB = (a, b) => {
  const startingChar = 'S';
  const endingChar = 'E';
  if(b === startingChar) {
    return false;
  }
  if(a === endingChar) {
    return false;
  }

  let aCode = a !== startingChar ? a.charCodeAt(0) - 97 : 'a'.charCodeAt(0) - 97;
  let bCode = b !== endingChar ? b.charCodeAt(0) - 97 : 'z'.charCodeAt(0) - 97;

  return (bCode-aCode)<=1;
}

const canWalkFromBtoA = (b, a) => {
  const startingChar = 'E';
  const endingChar = 'S';

  if(b === endingChar) {
    return false;
  }
  if(a === startingChar) {
    return false;
  }
  
  let aCode = a !== endingChar ? a.charCodeAt(0) - 97 : 'a'.charCodeAt(0) - 97;
  let bCode = b !== startingChar ? b.charCodeAt(0) - 97 : 'z'.charCodeAt(0) - 97;

  if(aCode + 1 < bCode) {
    return false;
  } 
  if(aCode > bCode) {
    return true;
  }
  if(aCode + 1 >= bCode) {
    return true;
  }
}

const getGraphId = (i, j, letter) => {
  if(letter === 'S') {
    return 'S';
  } else if(letter === 'E') {
    return 'E';
  }
  return `${i}-${j}`;
}

const djikstraAlgorithm = (graph, startNodeId, map) => {
  let distances = {};

  // Stores the reference to previous nodes
  let prev = {};
  let pq = new PriorityQueue((a, b) => {
    if (a.weight > b.weight) {
      return -1;
    }
    if (a.weight < b.weight) {
      // prioratize newest cars
      return 1;
    }
    // with lowest price
    return a.weight < b.weight ? -1 : 1;
  });

  // Set distances to all nodes to be infinite except startNode
  distances[startNodeId] = 0;
  pq.enqueue({node: startNodeId, weight: 0});
  Object.keys(graph).forEach(node => {
      if (node !== startNodeId) {
        distances[node] = Infinity;
      }
      prev[node] = null;
  });

  while (!pq.isEmpty()) {
    let {node, weight} = pq.dequeue();
    Object.keys(graph[node]).forEach(neighbor => {
      let alt = distances[node] + 1;
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        prev[neighbor] = node;
        pq.enqueue({node: neighbor, weight: distances[neighbor]});
      }
    });
  }

  return distances;
}

const buildGraphFromStoE = (map, graph) => {
  for(let i = 0; i<map.length; i++) {
    for(let j = 0; j<map[i].length; j++) {
      const letter = map[i][j];
      for(let x = -1; x<=1; x++) {
        for(let y = -1; y<=1; y++) {
          if((x === -1 && y === -1) ||
            (x === 1 && y === 1) ||
            (x === 0 && y === 0) ||
            (x === -1 && y === 1) ||
            (x === 1 && y === -1)
          ) {
            continue;
          }
          if(i+x >= 0 && j+y >=0 && i+x < map.length && j+y < map[i].length) {
            if(canWalkFromAToB(letter, map[i+x][j+y])) {
              graph[getGraphId(i,j, map[i][j])][getGraphId(i+x, j+y, map[i+x][j+y])] = 1;
            }
          }
        }
      }
    }
  }
  return graph;
}

const buildGraphFromEtoS = (map, graph) => {
  for(let i = 0; i<map.length; i++) {
    for(let j = 0; j<map[i].length; j++) {
      const letter = map[i][j];
      for(let x = -1; x<=1; x++) {
        for(let y = -1; y<=1; y++) {
          if((x === -1 && y === -1) ||
            (x === 1 && y === 1) ||
            (x === 0 && y === 0) ||
            (x === -1 && y === 1) ||
            (x === 1 && y === -1)
          ) {
            continue;
          }
          if(i+x >= 0 && j+y >=0 && i+x < map.length && j+y < map[i].length) {
            if(canWalkFromBtoA(letter, map[i+x][j+y])) {
              graph[getGraphId(i,j, map[i][j])][getGraphId(i+x, j+y, map[i+x][j+y])] = 1;
            }
          }
        }
      }
    }
  }
  return graph;
}

const map = [];
const graph = {};
let counter = -1;
rl.on('line', (line) => {
  counter += 1;
  const splitLine = line.split('');
  map.push(splitLine);
  splitLine.forEach((letter, j) => {
    graph[getGraphId(counter, j, letter)] = {};
  });
}).on('close', () => {
  // build graph of map
  const forwardGraph = buildGraphFromStoE(map, graph);

  const distances = djikstraAlgorithm(forwardGraph, 'S', map);
  console.log(distances['E']);

  const aIds = [];
  map.forEach((row, i) => {
    row.forEach((letter, j) => {
      if(letter === 'a') {
        aIds.push(getGraphId(i,j,letter));
      }
    });
  });

  let min = distances['E'];
  let mins = [];
  aIds.forEach(id => {
    const backwardDistances = djikstraAlgorithm(forwardGraph, id, map);
    if(backwardDistances['E'] < min) {
      min = backwardDistances['E'];
      mins.push(backwardDistances['E']);
    }
  });
  console.log(min);
});