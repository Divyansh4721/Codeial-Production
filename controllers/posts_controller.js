const Post = require('../models/post');
const Comment = require('../models/comments');
const Like = require('../models/like');

const fs = require('fs');
const path = require('path');


module.exports.create = async function (req, res) {
    try {
        Post.uploadedPostImage(req, res, function (err) {
            if (err) {
                console.log('******Multer Error', err);
                if (req.xhr) {
                    return res.status(200).json({
                        status: 'error',
                        message: 'File Type Not Correct!',
                    });
                }
                req.flash('error', 'File Type Not Correct!');
                return res.redirect('back');
            }
            console.log(req.body.content, req.user._id);
            Post.create({ content: req.body.content, user: req.user._id, }, function (err, newPost) {
                Post.findById(newPost._id)
                    .populate('user')
                    .exec(function (err, posts) {

                        if (req.file) {
                            posts.postImage = Post.postPath + '/' + req.file.filename;
                        }
                        posts.save();
                        posts.user = { name: posts.user.name, _id: posts.user._id, avatar: posts.user.avatar };
                        if (req.xhr) {
                            return res.status(200).json({
                                data: {
                                    post: posts,
                                },
                                status: 'success',
                                message: 'Posted Successfully!',
                            });
                        }
                        req.flash('success', 'Posted Successfully!');
                        return res.redirect('back');
                    });
            });

        });
    }
    catch (err) {
        console.log(err);
        if (req.xhr) {
            return res.status(200).json({
                status: 'error',
                message: 'Error in creating Post!',
            });
        }
        req.flash('error', 'Error in creating Post!');
        return res.redirect('back');
    }
};


module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id) {

            //deleting post image
            if (fs.existsSync(path.join(__dirname, '..', post.postImage))) {
                fs.unlinkSync(path.join(__dirname, '..', post.postImage));
            }

            await Comment.deleteMany({ post: req.params.id });
            await Like.deleteMany({ likeable: req.params.id });
            await Like.deleteMany({ likeable: { $in: post.comments } });


            post.remove();

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id,
                    },
                    status: 'success',
                    message: 'Post Deleted Successfully!',
                });
            }

            req.flash('success', 'Post Deleted Successfully!');
            return res.redirect('back');
        }

        else {
            if (req.xhr) {
                return res.status(200).json({
                    status: 'error',
                    message: 'You cannot delete this post!',
                });
            }
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        if (req.xhr) {
            return res.status(200).json({
                status: 'error',
                message: 'Error in Deleting Post!',
            });
        }
        req.flash('error', 'Error in Deleting Post!');
        return res.redirect('back');
    }
};