const mongoose = require('mongoose');
const schema = mongoose.Schema;

const imageSchema = new schema({
    buffer: Buffer,
    mimetype: String, 
    name: String,
    encoding: String
})

module.exports = mongoose.model("Image", imageSchema);