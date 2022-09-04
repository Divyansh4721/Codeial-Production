const mongoose = require('mongoose');

const friendshipsSchema = new mongoose.Schema({
    firstUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    secondUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
});
const Friendship = mongoose.model('Friendship', friendshipsSchema);

module.exports = Friendship;