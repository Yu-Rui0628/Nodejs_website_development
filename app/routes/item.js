const express = require('express');
const session = require('express-session');

const router = express.Router();

const itemController = require('../controllers/itemController')

router.get('/item', itemController.item);

router.post('/addQuantity',(req,res)=>{
    var sess = req.session;
    var itemId = req.body.itemId;
    
    
    // console.log(itemId);
    const stockSession = "stock"+itemId;
    const cartSession = "cart"+itemId;
    
    
    var cart =sess[cartSession];
    var quantity = parseInt(cart)+parseInt(req.body.quantity);
    
    if (sess.loginstatus==false){
        
        
        res.json({message: "failed"});
    }else if (quantity>sess[stockSession]){
        res.json({message: "out"});
    }else{
       
        itemController.addQuantity(req,res);
    }
    
});

router.post('/comment',(req,res)=>{
    var sess = req.session;
   
    if (sess.loginstatus==false){
        
        
        res.json({message: "failed"});
    }else{
       
        itemController.comment(req,res);
    }
    
});

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