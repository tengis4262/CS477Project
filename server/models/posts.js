const { ObjectId, Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    user: {
        userId: ObjectId,
        username: String
    },
    text: String,
    like: {
        type: Number,
        default: 0
    },
    comments: [{
        userId: ObjectId,
        username: String,
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
},
    { timestamps: true });


module.exports = mongoose.model('Post', postSchema);