const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    //this defines the object id of the like object
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        enum: ['Post', 'Comment'],
        required: true
    },
}, {
    timestamps: true
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;