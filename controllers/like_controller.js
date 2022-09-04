
const Post = require('../models/post');
const Comment = require('../models/comments');
const Like = require('../models/like');



module.exports.create = async function (req, res) {
    try {
        let reftype = req.body.reftype;
        let refobj;
        if (reftype == 'Post') {
            refobj = await Post.findById(req.body.refid);
        }
        else {
            refobj = await Comment.findById(req.body.refid);
        }
        if (!req.body.like) {

            if (refobj) {
                let like = await Like.create({
                    user: req.user._id,
                    likeable: req.body.refid,
                    onModel: reftype,
                });
                refobj.like.push(like);
                refobj.save();

                if (req.xhr) {
                    return res.status(200).json({
                        data: {
                            refid: refobj._id,
                            numoflikes: refobj.like.length,
                        },
                        status: 'success',
                        message: 'You Liked Successfully!',
                    });
                }
                req.flash('success', 'You Liked Successfully!');
                return res.redirect('back');
            }
        }
        else {
            if (refobj) {
                let like = await Like.findOneAndDelete({ user: req.user._id, likeable: req.body.refid });
                refobj.like.pull(like);
                refobj.save();

                if (req.xhr) {
                    return res.status(200).json({
                        data: {
                            refid: refobj._id,
                            numoflikes: refobj.like.length,
                        },
                        status: 'success',
                        message: 'You UnLiked Successfully!',
                    });
                }
                req.flash('success', 'You UnLiked Successfully!');
                return res.redirect('back');
            }
        }

        if (req.xhr) {
            return res.status(200).json({
                status: 'error',
                message: reftype + ' does not exist!',
            });
        }
        req.flash('error', reftype + ' does not exist!');
        return res.redirect('back');







    }
    catch (err) {
        console.log(err);
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