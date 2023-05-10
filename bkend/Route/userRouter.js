const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController')

router.route('/register').post(userController.registerUser);
router.route('/login').post(userController.loginUser);
router.route('/verify').get(userController.verifyMail);

router.route('/forgotpassword').post(userController.forgetPassword);
router.route('/changepassword/:id').get(userController.verifyPass);
router.route('/changepassword/:id').patch(userController.changePassword);
module.exports = router;