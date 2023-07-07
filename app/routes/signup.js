const express = require('express');
const router = express.Router();

const SignupController = require('../controllers/signupController')



router.get('/signup', SignupController.signup);

router.post('/signup', SignupController.addUser);
router.get('/validate-email', SignupController.validationSuccess)

module.exports = router;








