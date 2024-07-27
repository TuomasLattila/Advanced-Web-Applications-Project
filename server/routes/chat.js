const express = require('express')
const router = express.Router()

const passport = require('../strategy/auth')

const Message = require('../models/Message')
const Swipe = require('../models/Swipe')
const User = require('../models/User')

const socketIo = require('../socket/io')

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
      if (socketIo.getIO().sockets.adapter.rooms.has(`${req.user._id}+${req.body.to}`)) { //Check if room exists whit this user
        socketIo.getIO().to(`${req.user._id}+${req.body.to}`).emit('message', newMessage)
      } else {
        socketIo.getIO().to(`${req.body.to}+${req.user._id}`).emit('message', newMessage)
      }
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  }
)

router.get('/messages/:userID', passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const messages = await Message.find({ $or: [{ from: req.user._id, to: req.params.userID }, { from: req.params.userID, to: req.user._id }] })
      res.send({username: req.user.username, messages: messages}) // OK
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
      res.send({ id: req.user._id, userlist: userlist}) // OK send users that have matched req client

    } catch (error) {
      res.sendStatus(500)
    }
  }
)

module.exports = router;