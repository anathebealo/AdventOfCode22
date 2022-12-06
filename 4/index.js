const data = require('./data.json');
const datatest = require('./datatest.json');

// part 1
let containingPairs = 0;
data.forEach(pair => {
  if((pair.a.minimum <= pair.b.minimum && pair.a.maximum >= pair.b.maximum) ||
    (pair.a.minimum >= pair.b.minimum && pair.a.maximum <= pair.b.maximum)
  ) {
    containingPairs++;
  }
});

console.log(containingPairs);

// part 2
let containingPairs2 = 0;
data.forEach((pair, i) => {
  // full contain
  if((pair.a.minimum <= pair.b.minimum && pair.a.maximum >= pair.b.maximum) ||
    (pair.a.minimum >= pair.b.minimum && pair.a.maximum <= pair.b.maximum)
  ) {
    containingPairs2++;
  } else if((pair.a.minimum >= pair.b.minimum && pair.a.minimum <= pair.b.maximum) ||
    (pair.a.maximum >= pair.b.minimum && pair.a.maximum <= pair.b.maximum)
  ) {
    // overlap
    containingPairs2++;
  }
});

console.log(containingPairs2);