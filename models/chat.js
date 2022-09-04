const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    chatid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;