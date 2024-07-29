const express = require('express')
const router = express.Router()

//Authorization strategy
const passport = require('../strategy/auth')

//Required models:
const Message = require('../models/Message')
const Swipe = require('../models/Swipe')
const User = require('../models/User')

//Bothways communication for keeping the chat in real-time:
const socketIo = require('../socket/io')


//ROUTES:

//This route is for saving new message to db
router.post('/message', passport.authenticate('jwt', { session: false }), //user needs to be authenticated
  async (req, res, next) => {
    try {
      const newMessage = new Message({ 
        from: req.user._id,
        to: req.body.to,  
        msg: req.body.msg,
        ts: Date.now()
      })
      await newMessage.save()
      if (socketIo.getIO().sockets.adapter.rooms.has(`${req.user._id}+${req.body.to}`)) { //Check if room exists whit this user (room name: id+id)
        socketIo.getIO().to(`${req.user._id}+${req.body.to}`).emit('message', newMessage) //communicate that new message is available
      } else {
        socketIo.getIO().to(`${req.body.to}+${req.user._id}`).emit('message', newMessage) //communicate that new message is available
      }
      res.sendStatus(200) //OK (New message saved and both clients notified about the new message)
    } catch (error) {
      console.log(error)
      res.sendStatus(500) //Internal server error (Something went wrong with the process)
    }
  }
)


//This route is for fetching the messages based on the authenticated user and given user
router.get('/messages/:userID', passport.authenticate('jwt', { session: false }), //user needs to be authenticated
  async (req, res, next) => {
    try {
      const messages = await Message.find({ $or: [{ from: req.user._id, to: req.params.userID }, { from: req.params.userID, to: req.user._id }] }) //find the messages between these users
      res.send({ messages: messages }) // OK (responds with the messagelist between correct users)
    } catch (error) {
      res.sendStatus(500) //Internal server error (Something went wrong with the process)
    }
  } 
)

//This route is for fetching the userlist that contains all the matched users for the authenticated user
router.get('/userlist', passport.authenticate('jwt', { session: false }), //user needs to be authenticated
  async (req, res, next) => {
    try {
      const foundSwipes = await Swipe.find({ $and: [{ $or: [{ from: req.user._id }, { to: req.user._id }] }, { liked: true }] }) //finds all likes (swipes with liked=true) from or to the authenticated user
      
      //This finds all users that have liked both ways with the authenticated user: -------
      const bothWaysLiked = [] //match list
      const swipeMap = new Map()
      foundSwipes.forEach(swipe => {
        if (swipeMap.has(`${swipe.to}->${swipe.from}`)) { //One by one checks the other way around (to-->from), does it exist
          bothWaysLiked.push((swipe.from.equals(req.user._id)? swipe.to : swipe.from)) // if exists, it is a match
        }
        swipeMap.set(`${swipe.from}->${swipe.to}`, true) //add every swipe to the map as a key value, which can be searched with the map.has() function
      })
      //------------------------------------------------------------------------------------

      const userlist = []
      for (const id of bothWaysLiked) {
        const user = await User.findById(id)
        userlist.push({ id: user._id, username: user.username, image: user.image }) // Adds required information about the matched user
      }
      res.send({ id: req.user._id, userlist: userlist}) // OK (send users that have matched  the authenticated client)
    } catch (error) {
      res.sendStatus(500) //Internal server error (Something went wrong with the process)
    }
  }
)

module.exports = router;