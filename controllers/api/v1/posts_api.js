const Post = require('../../../models/post');
const Comment = require('../../../models/comments');

const fs = require('fs');
const path = require('path');

module.exports.index = async function (req, res) {

    let posts = await Post.find({})
        .sort("-createdAt")
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user like'
            }
        })
        .populate({
            path: 'like'
        });
        
    for (let i of posts) {
        i.user.password = "";
        for (let j of i.comments) {
            j.user.password = "";
        }
    }
    return res.status(200).json({
        message: "List of Posts",
        posts: posts,
    });
}

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);
        if (post.user == req.user.id) {

            if (fs.existsSync(path.join(__dirname, '..', post.postImage))) {
                fs.unlinkSync(path.join(__dirname, '..', post.postImage));
            }

            post.remove();

            await Comment.deleteMany({ post: req.params.id });

            return res.status(200).json({
                message: 'Post and comments deleted SuccesFully',
            });
        }
        else {
            return res.status(401).json({
                message: 'You cannot delete this post',
            });
        }
    }
    catch (err) {
        console.log('Error in posts_api_v1', err);
        return res.status(500).json({
            message: 'Internal server Error',
        });
    }
};