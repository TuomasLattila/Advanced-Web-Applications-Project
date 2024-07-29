const mongoose = require('mongoose');
const schema = mongoose.Schema;
const mongodb = require('mongodb')

const messageSchema = new schema({
    from: mongodb.ObjectId,
    to: mongodb.ObjectId,
    msg: String,
    ts: Date
})

module.exports = mongoose.model("Message", messageSchema); //This model is for saving the messages 