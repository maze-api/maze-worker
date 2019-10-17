const { postMaze } = require('./worker-api');

//cellShape Options: 'Square', 'Hexagonal'
//algorithm Options: 'Recursive Backtracker, Growing Tree, Prims, Woven(only with Square)
//dimensions Options: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50
//number of post Options: 10, 100, 1000, 10000, 100000, 1000000

const cellShape = 'Square';
const algorithm = 'Recursive Backtracker';
const dimension = 5;

const options = {
  cellShape,
  algorithm,
  dimensions: { x: dimension, y: dimension },
  start: { x: 1, y: 1 }
};

const numberOfPosts = 10;



const startOfPost = process.hrtime.bigint();
Promise.all([...Array(numberOfPosts)].map(async() => {
  const start = process.hrtime.bigint();

  await postMaze(options);

  const end = process.hrtime.bigint();
  return end - start;
}))
  .then(arrayOfTimes => {
    const diff = process.hrtime.bigint() - startOfPost;
    console.log(`Number of posts: ${numberOfPosts}`);
    console.log(`Cell Shape: ${cellShape}`);
    console.log(`Algorithm: ${algorithm}`);
    console.log(`Dimensions: ${dimension}`);
    console.log(`Time it takes ${diff} milliseconds to post all ${numberOfPosts}`);

    arrayOfTimes.sort();
    const minTime = arrayOfTimes[0];
    const maxTime = arrayOfTimes[(arrayOfTimes.length - 1)];
    const medianTime = arrayOfTimes[(Math.ceiling((arrayOfTimes.length - 1) / 2))];

    const totalTime = arrayOfTimes.reduce((acc, time) => {
      return acc + time;
    }, 0);
    const meanTime = totalTime / arrayOfTimes.length;

    console.log(`Fastest Post Time: ${minTime}`);
    console.log(`Slowest Post Time: ${maxTime}`);
    console.log(`Median Post Time: ${medianTime}`);
    console.log(`Average Post Time: ${meanTime}`);
  });

