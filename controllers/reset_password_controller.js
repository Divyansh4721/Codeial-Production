const resetPassword = require('../models/reset_password');
const crypto = require('crypto');

const User = require('../models/user');
const resetpasswordMailer = require('../mailers/reset_password_mailer');



module.exports.sendToken = async function (req, res) {
    try {
        let user = await User.findOne({ email: req.params.email });
        if (user) {

            let newresetpass = await resetPassword.create({ email: user.email, name: user.name, accessToken: crypto.randomBytes(20).toString('hex'), isValid: true, });

            console.log(newresetpass);
            resetpasswordMailer.newLink({
                accesslink: 'http://localhost:8000/reset-password/?accessToken=' + newresetpass.accessToken,
                email: newresetpass.email,
                name: newresetpass.name,
            });

            return res.status(200).json({
                status: 'success',
                message: 'Please check your email to reset password!',
            });
        }
        else {
            return res.status(200).json({
                status: 'error',
                message: 'Email Id not found!!',
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(200).json({
            status: 'error',
            message: 'Email Id not found!!',
        });
    }
};


module.exports.checkToken = async function (req, res) {
    try {
        let reset_password = await resetPassword.findOne({ accessToken: req.query.accessToken });
        // reset_password.isValid = true;
        // reset_password.save();
        if (reset_password.isValid) {
            return res.render('resetpassword', {
                title: "Codeial | Reset Password",
                accessToken: req.query.accessToken,
            });
        }
        req.flash('error', 'Password Link Expired!');
        return res.redirect('/users/signin');
    }
    catch (err) {
        console.log(err);
        req.flash('error', 'Password Link Expired!');
        return res.redirect('/users/signin');
    }
};


module.exports.updatepassword = async function (req, res) {
    try {
        let reset_password = await resetPassword.findOne({ accessToken: req.body.accessToken });
        if (reset_password.isValid) {
            if (req.body.password == req.body.cpassword) {
                reset_password.isValid = false;
                reset_password.save();
                let user = await User.findOneAndUpdate({ email: reset_password.email }, { password: req.body.password });
                req.flash('success', 'Password SuccessFully Changed!');
                return res.redirect('/users/signin');
            }
            else {
                req.flash('error', 'Password does not match!');
                return res.redirect('back');
            }
        }
        req.flash('error', 'Password Link Expired!');
        return res.redirect('/users/signin');
    }
    catch (err) {
        console.log(err);
        req.flash('error', 'Password Link Expired!');
        return res.redirect('/users/signin');
    }
};
