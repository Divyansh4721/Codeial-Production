const mongoose = require('mongoose');

const resetPassSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean,
        required: true
    },
}, {
    timestamps: true
});
const ResetPass = mongoose.model('ResetPass', resetPassSchema);

module.exports = ResetPass;