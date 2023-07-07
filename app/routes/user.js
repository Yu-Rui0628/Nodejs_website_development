const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController')

router.get('/user', userController.home);
router.post('/user', userController.editUser);
router.post('/user/pwd', userController.changePwd);
router.post('/user/addPhone', userController.addNewPhone);
router.post('/user/disablePhone', userController.disablePhone);
router.post('/user/enablePhone', userController.enablePhone);
router.post('/user/removePhone', userController.removePhone);
router.get('/logout', function(req, res){
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;