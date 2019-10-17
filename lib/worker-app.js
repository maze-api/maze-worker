const { postMaze } = require('./worker-api');
const {
  squareRB10X10,
  hexRB10X10,
  squareWoven10X10,
  squareGT10X10,
  hexGT10X10,
  squarePrims10X10,
  hexPrims10X10
} = require('./data/maze-options');


postMaze(squareRB10X10);
postMaze(hexRB10X10);
postMaze(squareWoven10X10);
postMaze(squareGT10X10);
postMaze(hexGT10X10);
postMaze(squarePrims10X10);
postMaze(hexPrims10X10);

Promise.all([...Array(1)].map(() => {
  return postMaze(squareRB10X10);
}));