const express = require('express');
const router = express.Router();
const path = require('path');

const searchController = require('../controllers/searchController')

router.get('/search',(req,res) =>{
  
  searchController.searchIndex(req,res);
});

router.get('/search/searchData', (req, res) => {
    //console.log("test1"+req.body.inputData);
    console.log("search:"+req.query.search);
    console.log("brand:"+req.query.brand);
    console.log("maximum:"+req.query.maximum);
    searchController.searchData(req, res);
    
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



