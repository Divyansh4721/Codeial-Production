const express = require('express');

const router = express.Router();

const newUserAuthController = require('../controllers/newUserAuth_controller');

router.get('/', newUserAuthController.checkToken);

module.exports = router;