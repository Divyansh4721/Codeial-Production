const express = require('express');

const router = express.Router();

const passport = require('passport');

const likeController = require('../controllers/like_controller');

router.post('/create', passport.checkAuthentication, likeController.create);

// router.get('/destroy', passport.checkAuthentication, likeController.destroy);

module.exports = router;