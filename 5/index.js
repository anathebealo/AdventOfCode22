const data = require('./data.json');

let { moves, config } = JSON.parse(JSON.stringify(data));

// part 1
moves.forEach(move => {
  config[move.ending - 1] = config[move.ending - 1].concat(config[move.starting - 1].splice(config[move.starting - 1].length - move.count).reverse());
});

let output = "";
config.forEach(stack => {
  output = output.concat(stack[stack.length - 1]);
});

console.log(output);

// part 2
moves = JSON.parse(JSON.stringify(data.moves));
config = JSON.parse(JSON.stringify(data.config));

moves.forEach(move => {
  config[move.ending - 1] = config[move.ending - 1].concat(config[move.starting - 1].splice(config[move.starting - 1].length - move.count));
});

let output2 = "";
config.forEach(stack => {
  output2 = output2.concat(stack[stack.length - 1]);
});

console.log(output2);