const User = require('../models/user');

module.exports.checkToken = async function (req, res) {
    try {
        let user = await User.findOne({ accessToken: req.query.accessToken });
        if (user.isValid) {
            user.isValid = false;
            user.verified = true;
            user.save();

            req.flash('success', 'Your Email Has Been Verified!');
            return res.redirect('/users/signin');
        }
        req.flash('error', 'Verification Link Expired!');
        return res.redirect('/users/signin');
    }
    catch (err) {
        console.log(err);
        req.flash('error', 'Verification Link Expired!');
        return res.redirect('/users/signin');
    }
};
