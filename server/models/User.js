const mongodb = require('mongodb')
const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema({
  username: { type: String, required: false},
  email: { type: String, required: true},
  password: { type: String, required: true},
  image: { type: mongodb.ObjectId, required: false}
})

module.exports = mongoose.model('User', userSchema)  