const { postMaze } = require('./worker-api');

const cellShapeAlgoArray = [
  {
    cellShape: 'Square',
    algorithm: 'Recursive Backtracker'
  },
  {
    cellShape: 'Hexagonal',
    algorithm: 'Recursive Backtracker'
  },
  {
    cellShape: 'Square',
    algorithm: 'Growing Tree'
  },
  {
    cellShape: 'Hexagonal',
    algorithm: 'Growing Tree'
  },
  {
    cellShape: 'Square',
    algorithm: 'Prims'
  },
  {
    cellShape: 'Hexagonal',
    algorithm: 'Prims'
  },
  {
    cellShape: 'Square',
    algorithm: 'Woven'
  }
];

const dimensionArray = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];



[...Array(100)].reduce(async() => {
  await loadSeedData();
})
  .then(() => {
    console.log('seed data loaded');
  });



async function loadSeedData() {

  await Promise.all([...Array(10)].map(async() => {

    const dimension = dimensionArray[Math.floor(Math.random() * (dimensionArray.length))];
    const cellShapeAlgo = cellShapeAlgoArray[Math.floor(Math.random() * (cellShapeAlgoArray.length))];
  
    const options = {
      ...cellShapeAlgo,
      dimensions: { width: dimension, height: dimension },
      start: { x: 1, y: 1 }
    };
  
    await postMaze(options);

  }));
}