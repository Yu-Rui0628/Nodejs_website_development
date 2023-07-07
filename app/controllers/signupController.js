const User = require('../models/usersModel');
const bcrypt = require('bcrypt');
const url = require('url');

var signupsuccess = false;

module.exports.validationcheck = (req, res) => {
    const { token } = req.query;

  
    res.status(200).send('Email successfully validated');
  };

module.exports.addUser = (req,res) => {
    
    const {firstname, lastname, email, password, confirmedpassword} = req.body;
    userData = {firstname, lastname, email, password, confirmedpassword};
    console.log("The Host is " + req.headers.host);
    
    const link = 'validate-email';
    User.FindUser(email, (err, user) =>{
        if(err){
          console.log("Error happened");
          res.json({ signupsuccess: false, alerts: "Error happened when sign up"});
        }else{
          if(user){
           
              console.log("User has exist");
              return res.json({ signupsuccess: false ,alerts: "User has exist"});
          
          }
          else{
            User.sendEmailVerification(req, res, email, link);
            res.json({ signupsuccess: false ,alerts: "please check your email"});
           
          }


        }

  });
};


module.exports.validationSuccess = function(req,res){
                  const { token } = req.query;
                  if(token == process.env.API_KEY){
                    User.createUser(userData, (err, user) => {
               
                        if (err) {
                        console.log('Error creating user:', err);
                        res.status(404).send('Email Failed to validate');

                        } else {
                        console.log('User created successfully:', user);
                        res.render("registerSuccess.ejs");
                        }
                    });
                  }else{
                    console.log("Token is not correct");
                    res.status(401).send('Invalid token' + token);
                  }

};

module.exports.signup = function(req, res) {
    res.render('signup.ejs');
};