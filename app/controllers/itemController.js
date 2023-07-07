const phoneList = require('../models/phonesModel');
const user = require('../models/usersModel');
const express = require('express');
const session = require('express-session');
const url = require('url');
const querystring = require('querystring');



module.exports.item = async function(req, res) {
    var sess = req.session;
    
    if ("loginstatus" in sess) {
        
        var loginstatus = sess.loginstatus ;
        
    } else{
       
        sess.loginstatus = false;
        var loginstatus = false;
    }
   

    
    const parsedUrl = url.parse(req.url);
    const itemId = querystring.parse(parsedUrl.query).id;

    //console.log(itemId);
    itemSession = "cart"+itemId;
    stockSession = "stock"+itemId;

    if (itemSession in sess) {
        
        var itemQuantity = sess[itemSession];
        
    } else{
       
        sess[itemSession] = 0;
        var itemQuantity = 0;
    }
    
    searchList = await new Promise((resolve, reject) => {
        phoneList.findId(itemId,(err, result) => {
            if (err) {
                reject("Cannot find");
            } else {
                resolve(result);
            }
        });
    });


    //console.log(searchList);
    sess[stockSession] = searchList.stock;

    seller = await new Promise((resolve, reject) => {
        user.FindUserById(searchList.seller,(err, result) => {
            if (err) {
                reject("Cannot find");
            } else {
                resolve(result);
            }
        });
    });

    rating = await new Promise((resolve, reject) => {
        phoneList.findAverageRating(itemId,(err, result) => {
            if (err) {
                reject("Cannot find");
            } else {
                resolve(result);
            }
        });
    });
    
   
    var list = [];
    
    
    if (searchList.reviews.length > 0) {
        for (const review of searchList.reviews) {
        var reviewList = {};
          try {
            const reviewer = await user.FindUserById(review.reviewer);
            reviewList[reviewer.firstname + " " + reviewer.lastname] = review.comment;
            list.push(reviewList);
          } catch (error) {
            console.error("Cannot find user");
          }
        }
      }
      //console.log(list);
      //console.log(sess);
    res.render('item.ejs',{'searchList':searchList,'seller':seller,'rating':rating,'reviewList':list,'loginstatus':loginstatus,'itemQuantity':itemQuantity});
};




module.exports.addQuantity = async function(req, res) {
    var sess = req.session;
    
  
    var quantityData = req.body.quantity;
    var itemId = req.body.itemId;
    itemSession = "cart"+itemId;
    
    var sessionQuantity = parseInt(sess[itemSession])+parseInt(quantityData);
    sess[itemSession] = sessionQuantity;
    
    res.json(sessionQuantity);
    

};




module.exports.comment = async function(req, res) {
    var sess = req.session;
    
  
    var comment = req.body.comment;
    var itemId = req.body.itemId;
    var hidden = req.body.hidden;
    var rating = parseInt(req.body.rating);
    
    
    var userid = sess.userid;
    
    console.log(hidden);
    if (hidden == "true"){
        var reviewData = {
            reviewer : userid,
            rating : rating,
            comment : comment,
            hidden : ""
        }
    }else{
        var reviewData = {
            reviewer : userid,
            rating : rating,
            comment : comment,
            
        }
    }
    
    phoneList.addNewComment(itemId,reviewData);
    username = await new Promise((resolve, reject) => {
        user.FindUserById(userid,(err, result) => {
            if (err) {
                reject("Cannot find");
            } else {
                resolve(result);
            }
        });
    }); 
    var data = {
        'username':username.firstname+" "+username.lastname,
        'comment':comment
    }
   
    res.json(data);


};

