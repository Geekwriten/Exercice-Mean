const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require("../models/user")


// Profile
router.post('/register', (req, res, next) => {
  console.log("2")
  let newUser = new User ({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    console.log("2")
    if(err) {
      res.json({success: false, msg: 'Failed to register user'});
    } else {
      res.json({success: true, msg: 'User registered'});
    }
  });
});

router.post('/authenticate', (req, res, next) => {
  console.log("2")
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user) {
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      console.log("3")
      if(err) throw err;
      if(isMatch) {
        const token = jwt.sign({data: user}, config.secret, {
          expiresIn: 604800
        });
        res.json({
          success: true,
          token: 'JWT ' + token,
          // DONT PUT PASSWORD
          user: {
            id:user._id,
            name: user.name,
            username:user.username,
            email:user.email
          }
        })
      } else {
        return res.json({success: false, msg: 'Invalid password'});
      }
    });
  });
});


  //profile

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  console.log("1")
  res.json({user: req.user});
});

  router.get('/validate', (req, res, next) => {
    console.log("1")
    res.send("VALIDATE");
  });

  module.exports = router;