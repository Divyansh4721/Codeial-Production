const express = require('express');
const router = express.Router();
const passport = require('passport');


const usersController = require('../controllers/users_controller');

router.use(express.static('./assets'));

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);

router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/updateform/:id', passport.checkAuthentication, usersController.updateform);

router.get('/signup', usersController.signup);

router.get('/signin', usersController.signin);

router.get('/signout', usersController.destroysession);


router.post('/signupform', usersController.createid);


//use passport as a middleware to authenticate
router.post('/signinform', passport.authenticate('local', { failureRedirect: '/users/signin' }), usersController.checkuser);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/users/signin' }), usersController.checkuser);

module.exports = router;