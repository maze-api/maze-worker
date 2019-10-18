require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises;
const { postMaze } = require('./worker-api');



//cellShape Options: 'Square', 'Hexagonal'
//algorithm Options: 'Recursive Backtracker, Growing Tree, Prims, Woven(only with Square)
//dimensions Options: 10, 25, 50, 100
//number of post Options: 1, 10, 50, 100, 200,
//number of executions: 

const cellShape = 'Square';
const algorithm = 'Recursive Backtracker';
const dimension = 100;

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


mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});


[...Array(numberOfExecutions)].reduce(async(results) => [

  ...await results,
  await postingTestRound()

], Promise.resolve([]))

  .then((resultsArray) => {

    const accumulator = resultsArray[0];
    resultsArray.splice(0, 1);

    const finalResults = resultsArray.reduce((acc, resultsObject, idx)=> {

      if(acc.minTime > resultsObject.minTime) acc.minTime = resultsObject.minTime;
      if(acc.maxTime < resultsObject.maxTime) acc.maxTime = resultsObject.maxTime;
      acc.timeToPostAll += resultsObject.timeToPostAll;
      acc.medianTime += resultsObject.medianTime;
      acc.meanTime += resultsObject.meanTime;

      if(idx === resultsArray.length - 1) {
        acc.timeToPostAll = acc.timeToPostAll / resultsArray.length;
        acc.medianTime = acc.medianTime / resultsArray.length;
        acc.meanTime = acc.meanTime / resultsArray.length;
      }

      return acc;

    }, accumulator);


    text += `Average metrics of ${numberOfPosts} posts, executed ${numberOfExecutions} times\n`;
    text += `Number of posts: ${numberOfPosts}\n`;
    text += `Cell Shape: ${cellShape}\n`;
    text += `Algorithm: ${algorithm}\n`;
    text += `Dimensions: ${dimension}\n`;
    text += `It takes an average of ${finalResults.timeToPostAll} milliseconds to post ${numberOfPosts} ${dimension}X${dimension} ${cellShape} ${algorithm} Mazes\n`;
    text += `The Fastest Individual Post Time: ${finalResults.minTime}\n`;
    text += `The Slowest Individual Post Time: ${finalResults.maxTime}\n`;
    text += `The Overall Average Median Individual Post Time: ${finalResults.medianTime}\n`;
    text += `The Overall Average Mean Individual Post Time: ${finalResults.meanTime}\n`;

    return fs.writeFile(`./lib/data/results/${dimension}X${dimension}/${numberOfPosts}-posts/${cellShape}-${algorithmName}-Metrics.txt`, text, { encoding: 'utf8' })
  
      .then(()=> {
        console.log(`${dimension}X${dimension}-${cellShape}-${algorithmName}-metrics-${numberOfPosts}posts-executed-${numberOfExecutions}times.txt file written`);
        
        mongoose.connection.close();
      });
  });





async function postingTestRound() {

  const startOfPost = Number(process.hrtime.bigint()) / 1000000;

  const results = await Promise.all([...Array(numberOfPosts)].map(async() => {

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
      results.maxTime = arrayOfTimes[(arrayOfTimes.length - 1)];
      results.medianTime = arrayOfTimes[(Math.ceil((arrayOfTimes.length - 1) / 2))];

      const totalTime = arrayOfTimes.reduce((acc, time) => {
        return acc + time;
      }, 0);
      results.meanTime = totalTime / arrayOfTimes.length;

      return results;
    });

  // await sleep(750);
  // await mongoose.connection.db.dropCollection('mazes');
  // await sleep(750);
  return results;
}

// const sleep = time => {
//   // eslint-disable-next-line no-unused-vars
//   return new Promise((resolve) => {
//     setTimeout (() => {
//       resolve();
//     }, time);
//   });
// };