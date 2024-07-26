const express = require('express')
const router = express.Router()

const passport = require('../strategy/auth')

const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const Message = require('../models/Message')
const Swipe = require('../models/Swipe')
const User = require('../models/User')

const io = require('../socket/io').getIO()

router.post('/message', passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const newMessage = new Message({
        from: req.user._id,
        to: req.body.to,  
        msg: req.body.msg,
        ts: Date.now()
      })
      await newMessage.save() 
      io.emit('message', newMessage) 
      res.sendStatus(200)
    } catch (error) {
      res.sendStatus(500)
    }
  }
)

router.get('/messages/:userID', passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const messages = await Message.find({ $or: [{ from: req.user._id, to: req.params.userID }, { from: req.params.userID, to: req.user._id }] })
      res.send(messages) // OK
    } catch (error) {
      res.sendStatus(500)
    }
  }
)

router.get('/userlist', passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const foundSwipes = await Swipe.find({ $and: [{ $or: [{ from: req.user._id }, { to: req.user._id }] }, { liked: true }] })
      
      const bothWaysLiked = []
      const swipeMap = new Map()
      foundSwipes.forEach(swipe => {
        if (swipeMap.has(`${swipe.to}->${swipe.from}`)) {
          bothWaysLiked.push((swipe.from.equals(req.user._id)? swipe.to : swipe.from))
        }
        swipeMap.set(`${swipe.from}->${swipe.to}`, true)
      })
      
      const userlist = []

      for (const id of bothWaysLiked) {
        const user = await User.findById(id)
        userlist.push({ id: user._id, username: user.username, image: user.image })
      }
      res.send(userlist) // OK send users that have matched req client

    } catch (error) {
      res.sendStatus(500)
    }
  }
)

module.exports = router;