const fs = require('node:fs');
const readline = require('node:readline');
const path = require('path');

const rl = readline.createInterface({
  input: fs.createReadStream(path.join(__dirname, 'data.txt')),
  crlfDelay: Infinity,
});

const forest = [];
rl.on('line', (line) => {
  const trees = line.split('');
  forest.push(trees);
}).on('close', () => {
  // part 1
  let visibleTrees = 0;
  let visibleForest = [];
  for(let i = 0; i<forest.length; i++) {
    visibleForest.push([]);
    for(let j = 0; j<forest[i].length; j++) {
      if(i === 0 || j === 0 || i === forest.length -1 || j === forest[i].length - 1) {
        visibleForest[i].push(true);
      } else {
        visibleForest[i].push(false);
      }
    }
  }

  // check from left
  for(let i = 0; i<forest.length; i++) {
    let maxTreeHeight = -1;
    for(let j = 0; j<forest[i].length; j++) {
      if(forest[i][j] > maxTreeHeight) {
        visibleForest[i][j] = true;
        maxTreeHeight = forest[i][j];
      }
    }
  }

  // check rows from top
  for(let i = 0; i<forest.length; i++) {
    let maxTreeHeight = -1;
    for(let j = 0; j<forest[i].length; j++) {
      if(forest[j][i] > maxTreeHeight) {
        visibleForest[j][i] = true;
        maxTreeHeight = forest[j][i];
      }
    }
  }

  // check rows from bottom
  for(let i = 0; i<forest.length; i++) {
    let maxTreeHeight = -1;
    for(let j = forest[i].length - 1; j>=0; j--) {
      if(forest[j][i] > maxTreeHeight) {
        visibleForest[j][i] = true;
        maxTreeHeight = forest[j][i];
      }
    }
  }

  // check from the right
  for(let i = 0; i<forest.length; i++) {
    let maxTreeHeight = -1;
    for(let j = forest[i].length - 1; j>=0; j--) {
      if(forest[i][j] > maxTreeHeight) {
        visibleForest[i][j] = true;
        maxTreeHeight = forest[i][j];
      }
    }
  }

  for(let i = 0; i<visibleForest.length; i++) {
    for(let j = 0; j<visibleForest[i].length; j++) {
      if(visibleForest[i][j]) {
        visibleTrees++;
      }
    }
  }
  console.log('part 1 - visible trees: ', visibleTrees);


  //part 2
  let scenicScores = [];
  for(let i = 0; i<forest.length; i++) {
    scenicScores.push([]);
    for(let j = 0; j<forest[i].length; j++) {
      scenicScores[i].push(0);
    }
  }

  let maxScenicScore = 0;
  for(let i = 0; i<forest.length; i++) {
    for(let j = 0; j<forest[i].length; j++) {
      let treeHeight = forest[i][j];
      let scenicScore = 1;

      // look up
      if(i > 0) {
        for(let d = i-1; d >= 0; d--) {
          if(forest[d][j] >= treeHeight || d === 0) {
            scenicScore *= (i-d);
            break;
          }
        }
      } else {
        scenicScore = 0;
      }

      // look down
      if(i < forest.length - 1) {
        for(let d = i+1; d < forest.length; d++) {
          if(forest[d][j] >= treeHeight || d === forest.length - 1) {
            scenicScore *= (d-i);
            break;
          }
        }
      } else {
        scenicScore = 0;
      }

      // look left
      if(j > 0) {
        for(let d = j-1; d >= 0; d--) {
          if(forest[i][d] >= treeHeight || d === 0) {
            scenicScore *= (j-d);
            break;
          }
        }
      } else {
        scenicScore = 0;
      }

      // look right
      if(j < forest[i].length - 1) {
        for(let d = j+1; d < forest[i].length; d++) {
          if(forest[i][d] >= treeHeight || d === forest[i].length - 1) {
            scenicScore *= (d-j);
            break;
          }
        }
      } else {
        scenicScore = 0;
      }

      scenicScores[i][j] = scenicScore;
      if(scenicScore > maxScenicScore) {
        maxScenicScore = scenicScore;
      }
    }
  }

  console.log('part 2 - max scenic score: ', maxScenicScore);
});