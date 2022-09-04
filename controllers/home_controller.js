

const Post = require('../models/post');
const User = require('../models/user');


module.exports.home = async function (req, res) {

    try {
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

        let users = await User.find({})
            .sort("name");


        //Searching friends in database and sorting them
        let friends;

        if (req.user) {
            let friendobj = await User.aggregate([{
                "$match": {
                    "_id": req.user._id,
                }
            }, {
                "$lookup": {
                    "from": 'users',
                    "localField": "friends",
                    "foreignField": "_id",
                    "as": "friends"
                }
            }, {
                "$unwind": "$friends"
            }, {
                "$sort": {
                    "friends.name": 1
                }
            }, {
                "$group": {
                    "friends": {
                        "$push": "$friends"
                    },
                    "_id": 0
                }
            }, {
                "$project": {
                    "_id": 0,
                    "friends.name": 1,
                    "friends._id": 1,
                    "friends.avatar": 1,
                    "friends.email": 1,
                }
            }]);
            if (friendobj.length > 0) {
                friends = friendobj[0].friends;
            }
        }
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            users: users,
            friends: friends,
        });

    }
    catch (err) {
        console.log(err);
        req.flash('error', 'Home Page Under Process!');
        return res.redirect('back');
    }

}




// module.exports.actionName = function(req, res){}