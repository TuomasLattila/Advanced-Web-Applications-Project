const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

//Authorization strategy:
const passport = require('../strategy/auth')

//Required models:
const Swipe = require('../models/Swipe')
const User = require('../models/User')


//ROUTES:

//Responds with the userlist of new users that have not been swiped by current user.
router.get('/list',
  passport.authenticate('jwt', { session: false }), //user needs to be authenticated
  async (req, res, next) => {
    try {
      let excludeIds = [new ObjectId(req.user._id)] //initialise with the current users id (this list is for excluding already swiped users)
      const swipes = await Swipe.find({from: req.user._id}) //find all swipes from the current user
      swipes.forEach((swipe) => {
        excludeIds.push(new ObjectId(swipe.to)) // add all the user id that have been already swiped by the current user
      })
      const userList = await User.find({ _id: { $nin: excludeIds } }) // find all the new users (exclude the swiped users)
      if (userList) {
        let resList = [] 
        userList.forEach(user => {
          resList.push({ username: user.username, image: user.image, email: user.email, description: user.description }) // required information about the user
        });
        res.json(resList) // OK (respond with the userlist)
      } else {
        res.sendStatus(400) //Bad request
      }
    } catch (error) {
      console.log(error) 
      res.sendStatus(500) //Internal server error (something went wrong with the process)
    }
})

//Add either like or dislike (swipe)
router.post('/add', passport.authenticate('jwt', { session: false }), //user needs to be authenticated
  async (req, res, next) => {
    try {
      const foundToUser = await User.findOne({ email: req.body.to_email }) // the user that has been liked or disliked
      const foundSwipe = await Swipe.findOne({ from: req.user._id, to: foundToUser._id }) //check if there already exists document for theese users (should not be possible)
      if (!foundSwipe && foundToUser) {
        const newSwipe = new Swipe({ //make new swipe document
          from: req.user._id,
          to: foundToUser._id
        })
        if (req.body.liked === true) { //if liked, set liked property to True
          newSwipe.liked = true
        } else {
          newSwipe.disliked = true //if disliked, set disliked property to True
        }
        await newSwipe.save()
        res.sendStatus(200) //OK (new like/dislike saved to database)
      } else {
        res.sendStatus(409) //conflict (this like/dislike already exists)
      }
    } catch (error) {
      console.log(error) 
      res.sendStatus(500) //Internal server error (something went wrong with the process)
    }
  }
)

module.exports = router