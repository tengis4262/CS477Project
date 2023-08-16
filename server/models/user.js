const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    },
    firstname: String,
    lastname: String,
    email: String,
    pNumber: String,
    address: String,
    follows: []
});



module.exports = mongoose.model('User', userSchema);