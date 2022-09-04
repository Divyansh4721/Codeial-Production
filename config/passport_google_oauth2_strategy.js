const passport = require("passport");
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

console.log(env.google_callbackURL);
//tell passport to use a new strategy for google
passport.use(new googleStrategy({
    clientID: env.google_clientID,
    clientSecret: env.google_clientSecret,
    callbackURL: env.google_callbackURL,
},
    function (accessToken, refreshToken, profile, done) {
        //find a user
        User.findOne({ email: profile.emails[0].value }).exec(function (err, user) {
            if (err) {
                console.log('Error in Google Strategy Passport', err);
                return;
            }
            //if found set this user as req.user
            if (user) {
                return done(null, user);
            }
            //if not found create the user and then set it as req.user
            else {
                User.create({
                    name: profile._json.name,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                    verified: true,
                    accessToken: " ",
                    isValid: false,
                    avatar: profile.photos[0].value,
                },
                    function (err, user) {
                        if (err) {
                            console.log('Error in Creating User', err);
                            return;
                        }
                        return done(null, user);
                    });
            }
        });
    }


));

module.exports = passport;