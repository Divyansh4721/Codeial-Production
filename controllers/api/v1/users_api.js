
const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');



module.exports.createSession = async function (req, res) {

    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user || user.password != req.body.password) {
            return res.status(422).json({
                message: 'Invalid Username/password',
            });
        }

        return res.status(200).json({
            message: 'Sign in Successfull here is your token!',
            data: {
                token: jwt.sign(user.toJSON(), env.JWT_secret, { expiresIn: '100000' }),
            }
        });

    } catch (err) {
        console.log('Error in users-api-v1', err);
        return res.status(500).json({
            message: 'Internal server Error',
        });
    }

};
module.exports.searchUser = async function (req, res) {
    if (req.query.name == "") {
        return res.status(200).json({
            message: 'Response',
            user: ''
        });
    }
    let name = req.query.name.toLowerCase();
    let user = await User.find({}, { name: 1, _id: 1, avatar: 1 }).sort("name");
    for (let i = 0; i < user.length; i++) {
        if (user[i].name.toLowerCase().indexOf(name) < 0) {
            user.splice(i, 1);
            i--;
        }
    }
    return res.status(200).json({
        message: 'Response',
        user: user,
    });
}