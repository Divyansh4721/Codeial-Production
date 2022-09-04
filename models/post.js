const mongoose = require('mongoose');


const multer = require('multer');
const path = require('path');
const POST_PATH = path.join('/uploads/posts/images');


const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    //include the array of id of all comments
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }
    ],
    postImage: {
        type: String,
    },
    like: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like',
        }
    ],
}, {
    timestamps: true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', POST_PATH));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

//static

postSchema.statics.uploadedPostImage = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
}).single('postImage');
postSchema.statics.postPath = POST_PATH;


const Post = mongoose.model('Post', postSchema);

module.exports = Post;