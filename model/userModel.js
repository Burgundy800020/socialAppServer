const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    follows:{
        required: true,
        type:[mongoose.ObjectId]
    },
    followers:{
        required: true,
        type:[mongoose.ObjectId]
    },
    followReqs:{
        required: true,
        type:[String]    
    }
})

module.exports = mongoose.model('user', userSchema)
