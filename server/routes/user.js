var express = require('express');
var router = express.Router();

//Register/Login modules
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')

//Models:
const User = require('../models/User')
const Image = require('../models/Image')

//Authorization:
const passport = require('../strategy/auth')


//ROUTES:

/* GET one user based based on given userid. */
router.get('/data', passport.authenticate('jwt', { session: false }), function(req, res, next) {
  res.json({
    username: req.user.username,
    email: req.user.email,
    image: req.user.image
  });
});

//Post request to register new user. Validates the email and password.
router.post('/register',
  body('email').isString().isEmail(), 
  body('password').isString().isStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}), 
  async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
      return res.sendStatus(400) //Bad request (Invalid email or passwords)
    }
    try {
      const foundUser = await User.findOne({ $or: [req.body.username !== ''? { username: req.body.username} : { email: req.body.email }, { email: req.body.email }]})
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

//Post request to log in a user, creates and returns JWT token
router.post('/login', async (req, res, next) => {
  try {
    const foundUser = await User.findOne({$or: [{ username: req.body.identifier }, { email: req.body.identifier }]})
    if (foundUser) {
      bcrypt.compare(req.body.password, foundUser.password, (err, same) => {
        if (same) {
          const secret = process.env.SECRET
          const token = jwt.sign({ _id: foundUser._id}, secret, { expiresIn: '30m' })
          if (token) {
            res.status(200).json({ success: true, token: token, user: {
              username: foundUser.username,
              email: foundUser.email,
              image: foundUser.image
            } }) //OK (Send new token and user info to client)
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

//This route replaces the old profile picture with new one, for given user. 
router.put('/update/image', async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ email: req.body.email })
    if (foundUser) {
      await Image.deleteOne({ _id: foundUser.image }) //Delete old picture
      foundUser.image = req.body.imgId
      await foundUser.save()
      res.sendStatus(200) //OK (New profile picture saved.)
    } else {
      res.sendStatus(400)//Bad request (User was not found)
    }
  } catch (error) {
    res.sendStatus(500) //Internal Server error (Something went wrong with the process)
  } 
})

//This route updates the old username with new, if it doesent already exist
router.put('/update/username', async (req, res, next) => {
  try {
    const foundOldUser = await User.findOne({ username: req.body.old_username })
    const foundNewUser = await User.findOne({ username: req.body.new_username })
    if (foundOldUser && !foundNewUser) {
      foundOldUser.username = req.body.new_username
      await foundOldUser.save()
      res.sendStatus(200) //OK (New username saved.)
    } else {
      res.sendStatus(409) //Conflict (Username already exists)
    }
  } catch (error) {
    res.sendStatus(500) //Internal Server error (Something went wrong with the process)
  }
})

//This route updates the old email with new, if it doesent already exist and has email structure
router.put('/update/email', 
  body('new_email').isString().isEmail(),
  async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
      return res.sendStatus(400) //Bad request (Invalid email)
    }
    try {
      const foundOldUser = await User.findOne({ email: req.body.old_email })
      const foundNewUser = await User.findOne({ email: req.body.new_email })
      if (foundOldUser && !foundNewUser) {
        foundOldUser.email = req.body.new_email 
        await foundOldUser.save()
        res.sendStatus(200) //OK (New username saved.)
      } else {
        res.sendStatus(409) //Conflict (Email already exists)
      }
    } catch (error) {
      res.sendStatus(500) //Internal Server error (Something went wrong with the process)
    }
  }
)

module.exports = router;
