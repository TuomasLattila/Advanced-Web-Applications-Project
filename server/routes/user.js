var express = require('express');
var router = express.Router();

//Register/Login modules
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')

//Models:
const User = require('../models/User')

//Authorization:
const passport = require('../strategy/auth')


//ROUTES:

/* GET one user based on userid. */
router.get('/profile', passport.authenticate('jwt', { session: false }), function(req, res, next) {
  res.send('Authorizied user');
});

//Post request to register new user
router.post('/register',
  body('email').isString().isEmail(), 
  body('password').isString().isStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}), 
  async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
      return res.sendStatus(400) //Bad request (Invalid email or passwords)
    }
    try {
      const foundUser = await User.findOne({ $or: [{ username: req.body.username}, { email: req.body.email }]})
      if (!foundUser) {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err
          bcrypt.hash(req.body.password, salt, async (err, hash) => {
            if (err) throw err
            const newUser = new User({
              username: req.body.username,
              email: req.body.email,
              password: hash,
              image: null
            })
            await newUser.save()
            res.sendStatus(200) //OK (New user saved)
          })
        })
      } else {
        res.sendStatus(409) //Conflict (Email or username already exists)
      }
    } catch (error) {
      res.sendStatus(500) //Internal Server error (Something went wrong with the process)
    }
})

//Post request to log in a user
router.post('/login', async (req, res, next) => {
  try {
    const foundUser = await User.findOne({$or: [{ username: req.body.identifier }, { email: req.body.identifier }]})
    if (foundUser) {
      bcrypt.compare(req.body.password, foundUser.password, (err, same) => {
        if (same) {
          const secret = process.env.SECRET
          const token = jwt.sign({ _id: foundUser._id}, secret)
          if (token) {
            res.status(200).json({ success: true, token: token}) //OK (Send new token to user)
          }
        } else {
          res.sendStatus(401) //Unauthorized (Password didn't match)
        }
      })
    } else {
      res.sendStatus(401) //Unauthorized (User not found, wrong email or username)
    }
  } catch (error) {
    res.sendStatus(500) //Internal Server error (Something went wrong with the process)
  }
})

module.exports = router;
