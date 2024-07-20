const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/User')

let authOpts = {}
authOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(),
authOpts.secretOrKey = process.env.SECRET

passport.use(new JwtStrategy(authOpts, async (payload, done) => {
  try {
    const user = await User.findOne({ _id: payload._id })
    if (user) {
        return done(null, user)
    } else {
        return done(null, false)
    }
  } catch (error) {
    return done(error, false)
  }
}))

module.exports = passport