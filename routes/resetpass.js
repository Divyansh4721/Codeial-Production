const express = require('express');

const router = express.Router();

const resetPassController = require('../controllers/reset_password_controller');

router.get('/', resetPassController.checkToken);

router.post('/update', resetPassController.updatepassword);

router.get('/:email', resetPassController.sendToken);

module.exports = router;