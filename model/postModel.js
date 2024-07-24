const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    time: {
        required: true,
        type: Number
    },
    date:{
        required: true,
        type: Date
    },
    author: {
        required: true,
        type: String
    },
    authorId: {
        required: true,
        type: mongoose.ObjectId
    },
    content:{
        required: true,
        type: String
    }
})

module.exports = mongoose.model('post', postSchema)
