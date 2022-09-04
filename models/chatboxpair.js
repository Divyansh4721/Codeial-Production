const mongoose = require('mongoose');

const chatboxpairSchema = new mongoose.Schema({
    user1: {
        type: String,
        required: true
    },
    user2: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});
const Chatboxpair = mongoose.model('Chatboxpair', chatboxpairSchema);

module.exports = Chatboxpair;