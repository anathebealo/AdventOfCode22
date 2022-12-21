const fs = require('node:fs');
const readline = require('node:readline');
const { performance } = require('perf_hooks');
const {
  Stack,
} = require('@datastructures-js/stack');
const path = require('path');
const { start } = require('node:repl');

const dataFile = {
  name: 'data.txt',

};

const dataTestFile =  {
  name: 'datatest.txt',
}

const fileToUse = dataTestFile;

const rl = readline.createInterface({
  input: fs.createReadStream(path.join(__dirname, fileToUse.name)),
  crlfDelay: Infinity,
});

let maxHistory = { history: {}, score: 0 };
const calculateScoreFromHistory = (history, graph) => {
  let score = 0;
  Object.keys(history.valves).forEach(valveName => {
    const valveDetails = history.valves[valveName];
    if(valveDetails.openTime !== -1) {
      score += (30-valveDetails.openTime)*graph[valveName].floRate;
    }
  });

  if(score > maxHistory.score) {
    maxHistory = { history, score }
  }
  return score;
}

let finishedPaths = 0;
let memo = {};
const dfs = (valve, graph, openValves, time, score) => {
  const stringOpenValves = JSON.stringify(openValves);
  let newScore = score;
  openValves.forEach(valve => {
    newScore += graph[valve].flowRate;
  });

  if(!memo[valve]) {
    memo[valve] = {};
  }
  if(!memo[valve][stringOpenValves]) {
    memo[valve][stringOpenValves] = {};
  }
  
  if(time > 30) {
    return 0;
  }

  if(memo[valve][stringOpenValves][time]) {
    return memo[valve][stringOpenValves][time];
  }

  let max = 0;
  if(!valve.isOpen) {
     // path 1 is to open valve, then continue
     const openValvesNew = JSON.parse(JSON.stringify(openValves));
     openValvesNew.push(valve);
     openValvesNew.sort();
     const updatedScore = newScore + graph[valve].flowRate;
     const x = dfs(valve, graph, openValvesNew, time+1, updatedScore);
     max = Math.max(x, max);
  }

  // path 2 is to continue without opening the valve
  graph[valve].edges.forEach(edge => {
    const x = dfs(edge, graph, openValves, time+1, newScore);
    max = Math.max(x, max);
  });

  memo[valve][stringOpenValves][time] = max;
  return max;
}

const depthFirstTraversalRecursive = (valve, graph, time, history) => {
  if(!memo[valve]) {
    memo[valve] = { open: {}, closed: {}}
  }

  if(time > 30) {
    finishedPaths++;
    if(finishedPaths%1000000 ===0) console.log(finishedPaths);
    return calculateScoreFromHistory(history, graph);
  }

  const historyCopy = JSON.parse(JSON.stringify(history));
  if(historyCopy.valves[valve].isOpen) {
    // if valve is already open, check movement to all neighbors
    if(memo[valve].open[time]) {
      return memo[valve][time];
    }
    let max = 0;
    graph[valve].edges.forEach(neighbor => {
      historyCopy.timeChart[time] = `You move to valve ${neighbor}`;
      let x = depthFirstTraversalRecursive(neighbor, graph, time+1, historyCopy);
      max = Math.max(x, max);
    });
    memo[valve].open[time] = max;
    return max;
  } else {
    // if valve is not opened there are two paths: open valve or check neighbors
    historyCopy.valves[valve].isOpen = true;
    historyCopy.timeChart[time] = `You open valve ${valve}`
    depthFirstTraversalRecursive(valve, graph, time+1, historyCopy);

    const historyCopy2 = JSON.parse(JSON.stringify(history));
    graph[valve].edges.forEach(neighbor => {
      historyCopy2.timeChart[time] = `You move to valve ${neighbor}`;
      depthFirstTraversalRecursive(neighbor, graph, time+1, historyCopy2);
    });
  }
}

const depthFirstTraversal = (graph, startingValve, state) => {
  /* 
  Store the root node in Container
  While (there are nodes in Container)
    N = Get the "next" node from Container
    Store all the children of N in Container
    Do some work on N
  */
  const stack = new Stack();
  stack.push({ valve: startingValve, history: state, time: 0 });
  while(!stack.isEmpty()) {
    const next = stack.pop();
    if(next.time === 31) {
      calculateScoreFromHistory(next.history, graph);
    }
  }
}

const graph = {};
rl.on('line', (line) => {
  // Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
  const valveName = line.split('; ')[0].replace('Valve ', '').split(' has flow rate=')[0];
  const flowRate = parseInt(line.split('; ')[0].replace('Valve ', '').split(' has flow rate=')[1]);
  const edges = line.split('; ')[1].replace('tunnels lead to valves ', '').replace('tunnel leads to valve ', '').split(', ');
  graph[valveName] = {
    name: valveName,
    flowRate,
    edges
  };
}).on('close', () => {
  console.log(graph);

  // const startState = { valves: {}, timeChart: {}};
  // Object.keys(graph).forEach(valveName => {
  //   const valve = graph[valveName];
  //   startState.valves[valveName] = { 
  //     isOpen: valve.flowRate === 0,
  //     openTime: valve.flowRate === 0 ? -1 : null,
  //   };
  // });

  const openValves = [];
  Object.keys(graph).forEach(valveName => {
    const valve = graph[valveName];
    if(valve.flowRate === 0) {
      openValves.push(valve.name);
    }
  });

  openValves.sort();
  var startTime = performance.now()
    //valve, graph, openValves, time, score
  const x = dfs('AA', graph, openValves, 0, 0);
  console.log(x);
  var endTime = performance.now()
  console.log(`Depth first traversal took ${(endTime - startTime)*.001} seconds`);
});