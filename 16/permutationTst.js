const fs = require('node:fs');
const readline = require('node:readline');
const { performance } = require('perf_hooks');
const {
  PriorityQueue,
} = require('@datastructures-js/priority-queue');
const path = require('path');
const { start } = require('node:repl');

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

const bfs = (v, desiredV, graph, distance) => {
  if(v === desiredV) {
    return distance;
  }

  let min = Object.keys(graph).length + 1;
  graph[v].edges.forEach(neighbor => {
    const x = bfs(neighbor, desiredV, graph, distance+1);
    min = Math.min(min, x);
  });

  return min;
}

const iterativeBfs = (v, d, graph) => {
  /* 
  Store the root node in Container
  While (there are nodes in Container)
    N = Get the "next" node from Container
    Store all the children of N in Container
    Do some work on N
  */
  let queue = new PriorityQueue((a, b) => {
    if (a.distance > b.distance) {
      return -1;
    }
    if (a.distance < b.distance) {
      return 1;
    }
    return a.distance < b.distance ? -1 : 1;
  });

  const discovered = {[v.name]: true};
  queue.enqueue({...v, distance: 0});
  while(!queue.isEmpty()) {
    const next = queue.dequeue();
    if(next.name === d.name) {
      return next.distance;
    }

    next.edges.forEach(n => {
      const node = graph[n];
      if(!discovered[node.name]) {
        discovered[node.name] = true;
        queue.enqueue({...node, distance: next.distance + 1});
      }
    });
  }
}

const graph = {};
rl.on('line', (line) => {
  // Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
  const valveName = line.split('; ')[0].replace('Valve ', '').split(' has flow rate=')[0];
  const flowRate = parseInt(line.split('; ')[0].replace('Valve ', '').split(' has flow rate=')[1]);
  // console.log(line.split('; ')[1]);
  const edges = line.split('; ')[1].replace('tunnels lead to valves ', '').replace('tunnel leads to valve ', '').split(', ');
  graph[valveName] = {
    name: valveName,
    flowRate,
    edges
  };
}).on('close', () => {
  console.log(graph);
  const distances = {};
  Object.keys(graph).forEach(v => {
    distances[v] = {};
    Object.keys(graph).forEach(d => {
      if((graph[v].flowRate > 0 || v === 'AA') && graph[d].flowRate > 0 && v !== d) {
        distances[v][d] = parseInt(iterativeBfs(graph[v], graph[d], graph, 0));
      }
    });
  });
  console.log(distances);

  const nodesToPermute = [];
  Object.keys(distances).forEach(node => {
    if(node !== 'AA' && Object.keys(distances[node]).length > 0) {
      nodesToPermute.push(node);
    }
  });
  console.log(nodesToPermute);

  let result = [];
  const calculatePath = (path, distances, graph, debug = false) => {
    let score = 0;
    let scorePerMinute = 0;
    let time = 0;
    let startNode = 'AA';
    let openValves = '';
    path.forEach((node, index) => {
      const distance = distances[startNode][node];

      if(time + distance <= 30) {
        // move to node
        openValves = path.slice(0,index).join(', ');
        for(let i = 1; i<distance+1; i++) {
          debug && console.log(`== minute ${time + i} == `);
          debug && console.log(`${openValves} valves are open, releasing ${scorePerMinute} pressure`);
          debug && console.log(`you are moving to valve ${node}\n`);
          score += scorePerMinute;
        }
        time += distance;

        // while moving the score increases by scorePerMinute each minute
        debug && console.log(`== minute ${time + 1} == `);
        debug && console.log(`${openValves} valves are open, releasing ${scorePerMinute} pressure`);
        debug && console.log(`you open valve ${node}\n`);
        // open valve
        time += 1;
        score += scorePerMinute;
        scorePerMinute += graph[node].flowRate;
        startNode = node;
        openValves = path.slice(0,index+1).join(', ');
      } 
    });

    if(time < 30) {
      // ride out the rest of the time collecting scorePerMinute
     for(let i = 0; i<30-time; i++){
      debug && console.log(`== minute ${time + i + 1} == `);
      debug && console.log(`${openValves} valves are open, releasing ${scorePerMinute} pressure`)
      score += scorePerMinute;
     }
    }
    
    return score;
  }

  const checkNodeDistances = (path, distances, debug = false) => {
    let startNode = 'AA';
    let totalDistance = 0;
    debug && console.log(path.join(', '));
    for(let i = 0; i<path.length; i++) {
      const node = path[i];
      debug && console.log(`checking distance from ${startNode} to ${node}`);
      const distance =  parseInt(distances[startNode][node]);
      totalDistance += distance;
      startNode = node;
    }
    debug && console.log('total Distance: ' + totalDistance);
    return totalDistance;
  }

  let max = 0;
  let maxPath = [];
  let count = 0;
  let tries = [];

  const permute = (arr, m = [], distances, graph) => {
    count++;
    const calcPath = calculatePath(m, distances, graph);
    if(calcPath > max) {
      max = calcPath;
      maxPath = m;
    }

    tries.push({path: m, score: calcPath});

    if(arr.length > 0 && checkNodeDistances(m, distances)<50) {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        let newM = m.concat(next);

        permute(curr.slice(), newM, distances, graph);
     }
   }
 }

 // with full input this will output 1307674368000 permuted arrays to check the score of...
 // 1023 too low, 1516 too high
  permute(nodesToPermute, [], distances, graph)
  // tries.forEach(set => {
  //   console.log(set.join(', '));
  // });
  console.log(calculatePath(maxPath, distances, graph, true));

  console.log('');
  console.log(`Best path: ${maxPath}`);
  
  const fs = require('fs')      
  // Data which will write in a file.
  let data = JSON.stringify(tries); 
  // Write data in 'Output.txt' .
  fs.writeFile(path.join(__dirname, 'Output.txt'), data, (err) => { 
      // In case of a error throw err.
      if (err) throw err;
  });

  console.log(max);
});