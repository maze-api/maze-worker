require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises;
const { postMaze } = require('./worker-api');



//cellShape Options: 'Square', 'Hexagonal'
//algorithm Options: 'Recursive Backtracker, Growing Tree, Prims, Woven(only with Square)
//dimensions Options: 10, 25, 50, 100
//number of post Options: 1, 10, 50, 100, 200,
//number of executions: 

const cellShape = 'Hexagonal';
const algorithm = 'Growing Tree';
const dimension = 5;

const numberOfPosts = 1;
const numberOfExecutions = 10;

const options = {
  cellShape,
  algorithm,
  dimensions: { width: dimension, height: dimension },
  start: { x: 1, y: 1 }
};

const algorithmName = algorithm.split(' ').join('-'); 

let text = '';

let minTimeArray = [];
let maxTimeArray = [];
let medianTimeArray = [];
let meanTimeArray = [];
let timeToPostAllArray = [];

mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});


[...Array(numberOfExecutions)].reduce(async(results) => [
  ...await results,
  console.log(results),
  return await postingTestRound()
], Promise.resolve([]))
  .then((results) => {
    console.log(results);
    minTimeArray.sort((a, b) => a - b);
    const theMinTime = minTimeArray[0];

    maxTimeArray.sort((a, b) => a + b);
    const theMaxTime = maxTimeArray[0];

    const totalOfTimeToPostAll = timeToPostAllArray.reduce((acc, time) => {
      return acc + time;
    }, 0);
    const avgTimeToPostAll = totalOfTimeToPostAll / timeToPostAllArray.length;

    const totalOfMedianTime = medianTimeArray.reduce((acc, time) => {
      return acc + time;
    }, 0);
    const avgMedianTime = totalOfMedianTime / medianTimeArray.length;

    const totalOfMeanTime = meanTimeArray.reduce((acc, time) => {
      return acc + time;
    }, 0);
    const avgMeanTime = totalOfMeanTime / meanTimeArray.length;


    text += `Average metrics of ${numberOfPosts} posts, executed ${numberOfExecutions} times\n`;
    text += `Number of posts: ${numberOfPosts}\n`;
    text += `Cell Shape: ${cellShape}\n`;
    text += `Algorithm: ${algorithm}\n`;
    text += `Dimensions: ${dimension}\n`;
    text += `It takes an average of ${avgTimeToPostAll} milliseconds to post ${numberOfPosts} ${dimension}X${dimension} ${cellShape} ${algorithm} Mazes\n`;
    text += `The Fastest Individual Post Time: ${theMinTime}\n`;
    text += `The Slowest Individual Post Time: ${theMaxTime}\n`;
    text += `The Overall Average Median Individual Post Time: ${avgMedianTime}\n`;
    text += `The Overall Average Mean Individual Post Time: ${avgMeanTime}\n`;

    return fs.writeFile(`./lib/data/results/${dimension}X${dimension}/${numberOfPosts}-posts/${cellShape}-${algorithmName}-Metrics.txt`, text, { encoding: 'utf8' })
      .then(()=> {
        console.log(`${dimension}X${dimension}-${cellShape}-${algorithmName}-metrics-${numberOfPosts}posts-executed-${numberOfExecutions}times.txt file written`);
        mongoose.connection.close();
      });
  });





async function postingTestRound() {

  const startOfPost = Number(process.hrtime.bigint()) / 1000000;

  await Promise.all([...Array(numberOfPosts)].map(async() => {

    const start = Number(process.hrtime.bigint()) / 1000000;
    await postMaze(options);
    const end = Number(process.hrtime.bigint()) / 1000000;

    return end - start;
  }))
    .then(arrayOfTimes => {
      const endOfPost = Number(process.hrtime.bigint()) / 1000000;

      let results = {};

      results.timeToPostAll = endOfPost - startOfPost;
      
      arrayOfTimes.sort((a, b) => a - b);
      results.minTime = arrayOfTimes[0];
      
      arrayOfTimes.sort((a, b) => a + b);
      results.maxTime = arrayOfTimes[0];
      results.medianTime = arrayOfTimes[(Math.ceil((arrayOfTimes.length - 1) / 2))];

      const totalTime = arrayOfTimes.reduce((acc, time) => {
        return acc + time;
      }, 0);
      results.meanTime = totalTime / arrayOfTimes.length;

      console.log(results);
      return results;
    });

  // await sleep(750);
  // await mongoose.connection.db.dropCollection('mazes');
  // await sleep(750);
}

const sleep = time => {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve) => {
    setTimeout (() => {
      resolve();
    }, time);
  });
};