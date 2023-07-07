const express = require('express');
const router = express.Router();
const app = express();
app.use(express.static('public'));
const LoginController = require('../controllers/loginController')




router.post('/login', LoginController.checkuser);
router.get('/login', LoginController.login);
router.get('/resetvalidation', LoginController.resetpassword);
router.post('/resetvalidation',LoginController.resetvalidation);
router.get('/resetSuccess', LoginController.resetSuccess);
router.post('/resetSuccess',LoginController.resetSuccess2)

module.exports = router;








