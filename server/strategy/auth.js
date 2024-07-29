const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;

//Required models:
const User = require('../models/User')

//Set options for the strategy:
let authOpts = {}
authOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(),
authOpts.secretOrKey = process.env.SECRET

passport.use(new JwtStrategy(authOpts, async (payload, done) => {
  try {
    const user = await User.findOne({ _id: payload._id }) //finds the correct user based on the id in the payload of the token
    if (user) {
        return done(null, user) //authorized
    } else {
        return done(null, false) //not authorized
    }
  } catch (error) {
    return done(error, false) //error
  }
}))

module.exports = passport