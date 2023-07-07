const User = require('../models/usersModel');
const phoneList = require('../models/phonesModel');
const { TopologyOpeningEvent } = require('mongodb');
//const userId = "5f5237a4c1beb1523fa3db5d";

module.exports.home = async function(req, res) {

    var sess = req.session;
    const userId = sess.userid;
    
    if ("loginstatus" in sess) {
        
        var loginstatus = sess.loginstatus ;
        
    } else{
       
        sess.loginstatus = false;
        var loginstatus = false;
    }
    
    let theUser

    theUser = await new Promise((resolve, reject) => {
        User.findById(userId, (err, result) => {
            if (err) {
                reject("Cannot find the user");
            } else {
                resolve(result);
            }
        });
    });

    let UserPhones

    UserPhones = await new Promise((resolve, reject) => {
        phoneList.getUserPhones(userId, (err, result) => {
            if (err) {
                reject("Cannot find the user");
            } else {
                resolve(result);
            }
        });
    });
    //console.log("PID: " + UserPhones[0]._id);
    
    //get the rating, toggle and reviews of each phone for client-side display
    let Rating
    var rating
    var toggle
    const reviews = [];

    for (let phone of UserPhones){
        //get rating
        Rating = await new Promise((resolve, reject) => {
            phoneList.findAverageRating(phone._id, (err, result) => {
                if (err) {
                    reject("Cannot find the phone");
                } else {
                    resolve(result);
                }
            });
        });
        //console.log(Rating);
        if (Rating.length == 0){
            rating = 0;
        }else{
            rating = Rating[0].avgRating.toFixed(2);
        }
        //console.log("rating: " + rating);
        phone.rating = rating;

        //console.log(phone);
        //console.log('disabled' in phone);
        //get toogle
        if (phone.disabled == ""){
            toggle = "Disable";
        }else{
            toggle = "Enable";
        }
        //console.log(toggle);
        phone.toggle = toggle;

        //get reviews of each phone
        reviews.push(...phone.reviews);    
    }

    //get the reviwers' names and replace their ids.
    //console.log(reviews);
    for (let reviwer of reviews){
        let phoneUser

        phoneUser = await new Promise((resolve, reject) => {
            User.findById(reviwer.reviewer, (err, result) => {
                if (err) {
                    reject("Cannot find the user");
                } else {
                    resolve(result);
                }
            });
        });
        if (phoneUser.firstname &&  phoneUser.lastname){
        reviwer.reviewer = phoneUser.firstname + " " + phoneUser.lastname;}
    }
    //console.log(reviews);

    res.render('user.ejs', {'theUser': theUser, 'userPhones': UserPhones, 'reviews': reviews, 'loginstatus':loginstatus});
};

module.exports.editUser = async function(req, res) {
    const userId = req.session.userid;
    const {firstname, lastname, email, requestType} = req.body;
    user = {firstname, lastname, email, requestType};
    //console.log(user);
    //console.log(user.requestType);
    if (user.requestType === 'requestUser') {
        
        let updatedUser
    
        updatedUser = await new Promise((resolve, reject) => {
            User.updateUser(userId, user, (err, result) => {
                if (err) {
                    reject("Cannot find the update user");
                } else {
                    resolve(result);
                }
            });
        });
    
        res.render('user.ejs', {'theUser': updatedUser});
    }
}

module.exports.changePwd = async function(req, res) {
    const userId = req.session.userid;
    //console.log(req.body);
    const {currentPassword, newPassword, requestType} = req.body;
    const newPwd = {currentPassword, newPassword, requestType};
    //console.log(newPwd);

    if(newPwd.requestType === 'requestUserPwd'){
        const isMatch =  await User.comparePassword(userId, newPwd);
        //console.log(isMatch.match);
        if (isMatch.match){
            User.changePassword(isMatch.email,newPwd.newPassword);
            res.json({result: "Your password has been changed."});
        }else{
            res.json({result: "Your password is not match with your current password."});
        }
    }
}

module.exports.addNewPhone = async function(req, res) {
    const userId = req.session.userid;
    const {phoneTitle, brand,price, quantity, requestType} = req.body;
    const newPhone = {phoneTitle, brand,price, quantity, requestType};
    //console.log(newPhone);
    if (newPhone.requestType === "requestaddNewPhone"){
        delete newPhone.requestType;
        //add new phone into user's db
        await User.addNewPhone(userId, newPhone);

        //add new phone into phonelist's db
        await phoneList.addNewPhone(userId, newPhone);

        res.json(req.body);
    }
}

module.exports.disablePhone = async function(req, res) {
    const userId = req.session.userid;
    const {phoneIds, requestType} = req.body;
    const disableP = {phoneIds, requestType};
    //console.log(disableP);
    if(disableP.requestType === "requestDisable"){
        delete disableP.requestType;
        for (let phoneId of disableP.phoneIds){
            phoneList.disable(phoneId);
        }
        
        res.json(req.body);
    }
}

module.exports.enablePhone = async function(req, res) {
    const userId = req.session.userid;
    const {phoneIds, requestType} = req.body;
    const enableP = {phoneIds, requestType};

    if(enableP.requestType === "requestEnable"){
        delete enableP.requestType;
        for (let phoneId of enableP.phoneIds){
            phoneList.enable(phoneId);
        }
        
        res.json(req.body);
    }
}

module.exports.removePhone = async function(req, res) {
    const userId = req.session.userid;
    const {phoneIds, requestType} = req.body;
    const removeP = {phoneIds, requestType};

    if(removeP.requestType === "requestDelete"){
        delete removeP.requestType;
        for (let phoneId of removeP.phoneIds){
            phoneList.remove(phoneId);
        }
        
        res.json(req.body);
    }
}