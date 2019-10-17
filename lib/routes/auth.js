const router = require('express').Router();
const User = require('../models/users');
const tokenService = require('../token-service');
const ensureAuth = require('../middleware/ensure-auth');

const getCredentials = body => {
  const { email, password } = body;
  delete body.password;
  return { email, password };
};

const sendUser = (res, user) => {
  return tokenService.sign(user)
    .then(token => res.json({ 
      _id: user._id,
      email: user.email,
      token: token 
    })
    );
};

const checkCredentialsExist = (email, password) => {
  if(!email || !password) {
    return Promise.reject({
      statusCode: 400,
      error: 'Email and password required'
    });
  }
  return Promise.resolve();
};





router

  .get('/verify', ensureAuth(), (req, res) => {
    res.json({ verified: true });
  })

  

  .post('/signup', ({ body }, res, next) => {
    const { email, password } = getCredentials(body);
    
    checkCredentialsExist(email, password)
      .then(() => {
        return User.exists({ email });
      })
   
      .then(exists => {
        if(exists) {
          throw {
            statusCode: 400,
            error: 'Email already in use'
          };
        }

        const user = new User(body);
        user.generateHash(password);
        return user.save();
      })
      .then(user => sendUser(res, user))
      .catch(next);

  })



  .post('/signin', ({ body }, res, next) => {
    const { email, password } = getCredentials(body);

    checkCredentialsExist(email, password)
      .then(() => {
        return User.findOne({ email });
      })
      .then(user => {
        if(!user || !user.comparePassword(password)) {
          throw {
            statusCode: 401,
            error: 'Invalid email or password'
          };
        }
        return sendUser(res, user);
      })   
      .catch(next);
  });



module.exports = router;