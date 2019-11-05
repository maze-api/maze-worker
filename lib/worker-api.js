const request = require('superagent');

async function postMaze(options) {
  return await request
    .post('https://maze-api.herokuapp.com/api/mazes')
    .set('Authorization', '5da8a3bc4acb4e0017f5de93')
    .send(options);
}



module.exports = {
  postMaze
};