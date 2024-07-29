const mongoose = require('mongoose');
const schema = mongoose.Schema;
const mongodb = require('mongodb')

const swipeSchema = new schema({
    from: mongodb.ObjectId,
    to: mongodb.ObjectId,
    liked: { type: Boolean, default: false },
    disliked: { type: Boolean, default: false } 
})

module.exports = mongoose.model("Swipe", swipeSchema); //This model is for saving likes and dislikes (swipe)