

const User = require('../models/user');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const newUserAuthMailer = require('../mailers/newUserAuthMailer');


module.exports.profile = async function (req, res) {
    try {
        let posts = await Post.find({ user: req.params.id })
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
        let user = await User.findById(req.params.id);
        if (user) {
            if (user.friends.includes(req.user.id)) {
                return res.render('user_profile', {
                    title: 'Codeial | Profile',
                    profile_user: user,
                    posts: posts,
                    isFriend: true,
                });
            }
            return res.render('user_profile', {
                title: 'Codeial | Profile',
                profile_user: user,
                posts: posts,
                isFriend: false,
            });
        }
        else {
            req.flash('error', 'User does not exists!');
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        req.flash('error', 'User does not exists!');
        return res.redirect('back');
    }
};
module.exports.updateform = async function (req, res) {
    try {
        if (req.user.id != req.params.id) {
            req.flash('error', 'You are not authorized!');
            return res.redirect('back');
        }
        let user = await User.findById(req.params.id);
        if (user) {
            user.password = "";
            return res.render('user_update', {
                title: 'Codeial | Update',
                profile_user: user,
            });
        }
        else {
            req.flash('error', 'User does not exists!');
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        req.flash('error', 'User does not exists!');
        return res.redirect('back');
    }
};

module.exports.update = async function (req, res) {
    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function (err) {
                if (err) {
                    console.log('************Multer Error', err);
                    req.flash('error', 'File Type Not Correct!');
                    return res.redirect('back');
                }

                if (req.body.password != "" && req.body.cpassword != user.password) {
                    req.flash('error', 'Current Password Incorrect!');
                    return res.redirect('back');
                }
                user.name = req.body.name;
                user.email = req.body.email;
                if (req.body.password != "") {
                    user.password = req.body.password;
                }

                if (req.file) {

                    if (user.avatar) {
                        if (fs.existsSync(path.join(__dirname, '..', user.avatar) && user.avatar != (User.avatarPath + '/defaultavatarpic/avatar-default'))) {
                            console.log("Changed");
                            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                        }
                        console.log(user.avatar);
                        console.log(User.avatarPath);
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                req.flash('success', 'Updated Successfully!');
                return res.redirect('/');
            });
        }
        catch (err) {
            console.log(err);
            req.flash('error', 'Error in Updating User!');
            return res.redirect('back');
        }

    }
    else {
        req.flash('error', 'You are not authorized!');
        return res.redirect('back');
    }
};

module.exports.signin = function (req, res) {
    if (req.isAuthenticated()) {
        req.flash('success', 'Already Signed In!');
        return res.redirect('/');
    }
    return res.render('user_signin', {
        title: "Codeial | Sign In"
    });
};

module.exports.signup = function (req, res) {
    if (req.isAuthenticated()) {
        req.flash('success', 'Already Signed In!');
        return res.redirect('/');
    }
    return res.render('user_signup', {
        title: "Codeial | Sign Up",
        defaultAvatarPath: User.avatarPath + '/defaultavatarpic/avatar-default'
    });
};


module.exports.createid = async function (req, res) {
    try {
        console.log(req.body);
        if (req.body.password != req.body.cpassword) {
            req.flash('error', 'Passwords does not match!');
            return res.redirect('back');
        }
        // //
        // let temp = await User.find({});
        // for (let i = 0; i < temp.length; i++) {
        //     temp[i].verified = true;
        //     temp[i].accessToken = " ";
        //     temp[i].isValid = false;
        //     temp[i].save();
        // }
        // //
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            let user = await User.create({
                email: req.body.email,
                name: req.body.name,
                avatar: req.body.avatar,
                password: req.body.password,
                verified: false,
                accessToken: crypto.randomBytes(20).toString('hex'),
                isValid: true,
            });
            newUserAuthMailer.newLink({
                accesslink: 'http://localhost:8000/verification-mail/?accessToken=' + user.accessToken,
                email: user.email,
                name: user.name,
            });
            req.flash('success', 'Check Your Email To Verify!');
            return res.redirect('/users/signin');
        }
        else {
            req.flash('error', 'User Already Exists!');
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        req.flash('error', 'Error in creating Account!');
        return res.redirect('back');
    }

};

module.exports.checkuser = function (req, res) {
    req.flash('success', 'Logged In Successfully');
    return res.redirect('/');
};

module.exports.destroysession = function (req, res) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You have been Logged Out');
        return res.redirect('/users/signin');
    });
};