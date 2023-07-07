const express = require('express');
const phoneList = require('../models/phonesModel');


module.exports.home = async function(req, res) {
    var sess = req.session;
    
    if ("loginstatus" in sess) {
        
        var loginstatus = sess.loginstatus ;
        
    } else{
       
        sess.loginstatus = false;
        var loginstatus = false;
    }
    //console.log(brand);
    let soldoutList;
    let highestRatingList;

    soldoutList = await new Promise((resolve, reject) => {
        phoneList.findLeastQuantity((err, result) => {
            if (err) {
                reject("Cannot find");
            } else {
                resolve(result);
            }
        });
    });


    highestRatingList = await new Promise((resolve, reject) => {
        phoneList.findHighestRating( (err, result) => {
            if (err) {
                reject("Cannot find");
            } else {
                resolve(result);
            }
        });
    });
    
    
    //console.log('test1:'+soldoutList);
    //console.log('test2:'+test);
    res.render('index.ejs',{'soldoutList':soldoutList, 'highestRatingList':highestRatingList,'loginstatus':loginstatus})
	
};


