var express = require('express');
var router = express.Router();

//Register/Login modules
const bcrypt = require('bcrypt') //for hashing the password
const { body, validationResult } = require('express-validator'); //for validating email and password
const jwt = require('jsonwebtoken') //for authorization strategy

//Required models:
const User = require('../models/User')
const Image = require('../models/Image')

//Authorization strategy:
const passport = require('../strategy/auth')


//ROUTES:

/* GET one user data based on given userid. */
router.get('/data', passport.authenticate('jwt', { session: false }), function(req, res, next) { //user needs to be authenticated
  res.json({
    username: req.user.username,
    email: req.user.email,
    description: req.user.description,
    image: req.user.image
  });
});

//Post request to register new user. Validates the email and password.
router.post('/register',
  body('email').isString().isEmail(), //validates the email
  body('password').isString().isStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}),  //validates the password
  async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
      return res.sendStatus(400) //Bad request (Invalid email or passwords)
    }
    try {
      const foundUser = await User.findOne({ $or: [req.body.username !== ''? { username: req.body.username} : { email: req.body.email }, { email: req.body.email }]}) //Check if user exists with given username or email
      if (!foundUser) {
        bcrypt.genSalt(10, (err, salt) => { //Generates salt for the hash process
          if (err) throw err
          bcrypt.hash(req.body.password, salt, async (err, hash) => { //hashes the password
            if (err) throw err
            const newUser = new User({ // creates new user document
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

//Post request to log in a user, creates and returns JWT token
router.post('/login', async (req, res, next) => {
  try {
    const foundUser = await User.findOne({$or: [{ username: req.body.identifier }, { email: req.body.identifier }]}) //finds the user based on given email or username
    if (foundUser) {
      bcrypt.compare(req.body.password, foundUser.password, (err, same) => { //compares the given password to the found password hash
        if (same) {
          const secret = process.env.SECRET
          const token = jwt.sign({ _id: foundUser._id}, secret, { expiresIn: '60m' }) //creates new JWT token for the user (user_id as payload)
          if (token) {
            res.status(200).json({ success: true, token: token }) //OK (Responds with the new token)
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

//This route replaces the old profile picture id with new one for given user, and deletes the old picture.
router.put('/update/image', passport.authenticate('jwt', { session: false }), //user needs to be authenticated
  async (req, res, next) => {
    try {
      const foundUser = await User.findById(req.user._id) //finds authenticated user document
      if (foundUser) {
        await Image.deleteOne({ _id: foundUser.image }) //Delete old picture from the client
        foundUser.image = req.body.imgId // set new image id to user document
        await foundUser.save()
        res.sendStatus(200) //OK (New profile picture saved.)
      } else {
        res.sendStatus(400)//Bad request (User was not found)
      }
    } catch (error) {
      console.log(error)
      res.sendStatus(500) //Internal Server error (Something went wrong with the process)
    } 
  }
)

//This route updates the old username with new, if it isn't already in use
router.put('/update/username', passport.authenticate('jwt', { session: false }), //user needs to be authenticated
  async (req, res, next) => {
    try {
      const foundClient = await User.findOne({ username: req.body.old_username })
      const foundOtherUser = await User.findOne({ username: req.body.new_username })
      if (foundClient && !foundOtherUser) { // if client exists and the new username is not in use
        foundClient.username = req.body.new_username //set new username
        await foundClient.save()
        res.sendStatus(200) //OK (New username saved.)
      } else {
        res.sendStatus(409) //Conflict (Username already exists)
      }
    } catch (error) {
      res.sendStatus(500) //Internal Server error (Something went wrong with the process)
    }
  }
)

//This route updates the old email with new, if it in't already in use, and has email structure
router.put('/update/email', passport.authenticate('jwt', { session: false }), //user needs to be authenticated
  body('new_email').isString().isEmail(), //validates the new email
  async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
      return res.sendStatus(400) //Bad request (Invalid email)
    }
    try {
      const foundClient = await User.findOne({ email: req.body.old_email })
      const foundOtherUser = await User.findOne({ email: req.body.new_email })
      if (foundClient && !foundOtherUser) { // if client exists and the new email is not in use
        foundClient.email = req.body.new_email //set new email
        await foundClient.save()
        res.sendStatus(200) //OK (New email saved.)
      } else {
        res.sendStatus(409) //Conflict (Email already exists)
      }
    } catch (error) {
      res.sendStatus(500) //Internal Server error (Something went wrong with the process)
    }
  }
)

//This route updates the old description to new
router.put('/update/description', passport.authenticate('jwt', { session: false }), //user needs to be authenticated
   async (req, res, next) => {
    try {
      const foundUser = await User.findById(req.user._id) //finds client
      if (foundUser) {
        foundUser.description = req.body.new_description //sets new description
        await foundUser.save()
        res.sendStatus(200) //OK (New description saved.)
      } else {
        res.sendStatus(400) //Bad request (User not found)
      }
    } catch (error) {
      console.log(error)
      res.sendStatus(500) //Internal Server error (Something went wrong with the process)
    }
  }
)

module.exports = router;
