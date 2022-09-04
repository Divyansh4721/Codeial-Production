const Post = require('../models/post');
const Comment = require('../models/comments');
const Like = require('../models/like');
// const commentsMailer = require('../mailers/comments_mailers');

const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');

module.exports.create = async function (req, res) {
    try {
        let post = await Post.findById(req.body.post);
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post,
            });
            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user', 'name avatar email');

            // comment[0].user={
            //     name:comment[0].user.name,
            //     avatar:comment[0].user.avatar,
            //     email:comment[0].user.email,
            // };
            // commentsMailer.newComment(comment);




            // let job = queue.create('emails',comment).save(function(err){
            //     if(err){
            //         console.log('Error in creating a Queue',er);
            //         return;
            //     }
            //     // console.log('job enqueued',job.id);
            // });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        postid: post._id,
                        numofcomment: post.comments.length,
                        comment: comment,
                    },
                    status: 'success',
                    message: 'You Commented Successfully!',
                });
            }

            req.flash('success', 'You Commented Successfully!');
            return res.redirect('back');
        }
        if (req.xhr) {
            return res.status(200).json({
                status: 'error',
                message: 'Post does not exist!',
            });
        }
        req.flash('error', 'Post does not exist!');
        return res.redirect('back');
    }
    catch (err) {
        console.log('Error in Commenting!', err);
        if (req.xhr) {
            return res.status(200).json({
                status: 'error',
                message: 'Error in Commenting!',
            });
        }
        req.flash('error', 'Error in Commenting!');
        return res.redirect('back');
    }
};


module.exports.destroy = async function (req, res) {
    try {
        let comment = await Comment.findById(req.params.id).populate('post');
        //.id means converting the object id into string
        if (comment.user == req.user.id || comment.post.user == req.user.id) {
            let post = await Post.findByIdAndUpdate(comment.post, { $pull: { comments: req.params.id } });
            comment.remove();

            await Like.deleteMany({ likeable: comment._id });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        postid: post._id,
                        numofcomment: post.comments.length - 1,
                        comment_id: req.params.id,
                    },
                    status: 'success',
                    message: 'Comment Deleted Successfully!',
                });
            }

            req.flash('success', 'Comment Deleted Successfully!');
            return res.redirect('back');
        }
        else {
            if (req.xhr) {
                return res.status(200).json({
                    status: 'error',
                    message: 'You cannot delete this Comment!',
                });
            }
            req.flash('error', 'You cannot delete this Comment!');
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log('Error in deleting Comment!', err);
        if (req.xhr) {
            return res.status(200).json({
                status: 'error',
                message: 'Error in deleting Comment!',
            });
        }
        req.flash('error', 'Error in deleting Comment!');
        return res.redirect('back');
    }

};