const fs = require('node:fs');
const readline = require('node:readline');
const { performance } = require('perf_hooks');
const path = require('path');

const dataFile = {
  name: 'data.txt',
  part1Bound: 2000000,
  part2Bound: 4000000,
  part2Multiply: 4000000,

};

const dataTestFile =  {
  name: 'datatest.txt',
  part1Bound: 10,
  part2Bound: 20,
  part2Multiply: 4000000,
}

const fileToUse = dataFile;

const rl = readline.createInterface({
  input: fs.createReadStream(path.join(__dirname, fileToUse.name)),
  crlfDelay: Infinity,
});

const getManhattanDistance = (pointA, pointB) => {
  return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y);
}

const checkIfSpotInAnySensor = (point, sensors) => {
  if(point.x <= 0 || point.y <= 0) {
    return true;
  }
  for(let i = 0; i<sensors.length; i++) {
    const sensor = sensors[i];
    if(getManhattanDistance(point, sensor.sensor) <= sensor.distance) {
      return true;
    }
  }
  return false;
}

const checkPerimeterOfSensor = (sensor, sensorData) => {
  const distanceOfPerimeter = sensor.distance + 1;
  for(let i = -1; i<=1; i++) {
    if(i === 0) continue;
    for(let j = -1; j<=1; j++) {
      if(j === 0) continue;
      for(let d = 0; d<=distanceOfPerimeter; d++) {
        const xSpot = sensor.sensor.x + parseInt(i*d);
        const ySpot = sensor.sensor.y + parseInt(j*(distanceOfPerimeter - d));
        if(xSpot > fileToUse.part2Bound || ySpot > fileToUse.part2Bound || xSpot < 0 || ySpot < 0) {
          continue;
        }
        if(!checkIfSpotInAnySensor({ x: xSpot, y: ySpot }, sensorData)) {
          // we're done!
          console.log('part 2 cell: ' + JSON.stringify({ x: xSpot, y: ySpot }));
          console.log('part 2 answer: ' + (parseInt(xSpot*fileToUse.part2Multiply) + parseInt(ySpot)));
          return true;
        }
      }
    }
  }
  return false;
}

const sensorData = [];
const sensors = [];
const beacons = [];
rl.on('line', (line) => {
  const sensorLine = line.split(':')[0].replace('Sensor at ', '');
  const sensorIndex = { 
    x: parseInt(sensorLine.split(', ')[0].replace('x=', '')),
    y: parseInt(sensorLine.split(', ')[1].replace('y=', '')),
  };
  sensors.push(sensorIndex);

  const beaconLine = line.split(':')[1].replace(' closest beacon is at ', '');
  const beaconIndex = { 
    x: parseInt(beaconLine.split(', ')[0].replace('x=', '')),
    y: parseInt(beaconLine.split(', ')[1].replace('y=', '')),
  };
  beacons.push(beaconIndex);

  sensorData.push({
    sensor: sensorIndex,
    beacon: beaconIndex,
    distance: getManhattanDistance(sensorIndex, beaconIndex)
  });
}).on('close', () => {
  // part 1
  const indexLine = fileToUse.part1Bound;
  const line = {};
  let lineSpots = 0;
  sensorData.forEach(sensor => {
    if(sensor.beacon.y === indexLine) {
      line[sensor.beacon.x] = 'B';
    }
    if((sensor.sensor.y < indexLine && sensor.sensor.y + sensor.distance >= indexLine) || 
       (sensor.sensor.y > indexLine && sensor.sensor.y - sensor.distance < indexLine)) {
      const outwardDistance = sensor.distance - Math.abs(indexLine - sensor.sensor.y);
      for(let x = sensor.sensor.x - outwardDistance; x<=sensor.sensor.x + outwardDistance; x++) {
        if(line[x] === undefined) {
          line[x] = '#';
          lineSpots++;
        }
      }
    }
  });
  console.log('part 1: ' + lineSpots);

  // part 2
  for(let i = 0; i<sensorData.length; i++) {
    const sensor = sensorData[i];
    if(checkPerimeterOfSensor(sensor, sensorData)) {
      break;
    }
  }
});