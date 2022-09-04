const express = require('express');

const router = express.Router();

const homeController = require('../controllers/home_controller');

console.log('Router Loaded!');

router.get('/', homeController.home);

router.use('/users', require('./users'));

router.use('/posts', require('./posts'));

router.use('/comments', require('./comments'));

router.use('/likes', require('./likes'));

router.use('/friendship', require('./friendship'));

router.use('/api', require('./api'));

router.use('/reset-password', require('./resetpass'));

router.use('/verification-mail', require('./newUserAuthVerify'));

//for any further routes access from here
//router.use('routename',require('routerpath'));

module.exports = router;