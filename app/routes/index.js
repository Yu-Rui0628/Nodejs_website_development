const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController')


router.get('/', homeController.home);
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








