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

const dimensionArray = [5, 10, 15, 20, 25];


Promise.all([...Array(10)].map(async() => {

  const dimension = dimensionArray[Math.floor(Math.random() * (dimensionArray.length))];
  const cellShapeAlgo = cellShapeAlgoArray[Math.floor(Math.random() * (cellShapeAlgoArray.length))];
  
  const options = {
    ...cellShapeAlgo,
    dimensions: { x: dimension, y: dimension },
    start: { x: 1, y: 1 }
  };
  
  await postMaze(options);

}));