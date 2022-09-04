
const Friendship = require('../models/friendships');
const User = require('../models/user');



module.exports.create = async function (req, res) {
    try {

        if (req.query.isFriend == 'false') {
            await Friendship.create({
                firstUser: req.user.id,
                secondUser: req.query.profileid,
            });

            let firstuser = await User.findById(req.user.id);
            let seconduser = await User.findById(req.query.profileid);

            firstuser.friends.push(req.query.profileid);
            firstuser.save();

            seconduser.friends.push(req.user.id);
            seconduser.save();

            if (req.xhr) {
                return res.status(200).json({
                    status: 'success',
                    message: 'Added ' + seconduser.name + ' as your friend!',
                    data: {
                        firstuser: firstuser,
                        seconduser: seconduser,
                    }
                });
            }
        }
        else {
            await Friendship.findOneAndDelete({
                firstUser: req.user.id,
                secondUser: req.query.profileid,
            });

            let firstuser = await User.findById(req.user.id);
            let seconduser = await User.findById(req.query.profileid);

            firstuser.friends.pull(req.query.profileid);
            firstuser.save();

            seconduser.friends.pull(req.user.id);
            seconduser.save();

            if (req.xhr) {
                return res.status(200).json({
                    status: 'success',
                    message: 'Removed ' + seconduser.name + ' as your friend!',
                    data: {
                        firstuser: firstuser,
                        seconduser: seconduser,
                    }
                });
            }
        }
    }
    catch (err) {
        console.log(err);
        if (req.xhr) {
            return res.status(200).json({
                status: 'error',
                message: 'Server Error!',
            });
        }
    }
};