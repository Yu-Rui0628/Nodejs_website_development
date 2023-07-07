
const User = require('../models/usersModel');
const bcrypt = require('bcrypt');
const url = require('url');

module.exports.login = function(req, res) {
    res.render('login.ejs');
};
module.exports.resetpassword = function(req,res){
    res.render('resetpassword.ejs');
};
module.exports.resetvalidation = async (req,res) => {
  const {email} = req.body;
  const link = 'resetSuccess';
  User.FindUser(email, (err,user)=>{
    if(err){
      console.log("Error happened when find user");
      res.json({resetSuccess:false, alerts: "Error happened when find user"});
    }else{
      if(user){
        console.log("Find the user, please check the email");
        process.env.USER_EMAIL = email;
        User.sendEmailVerification(req,res,email,link);
        res.json({resetSuccess:true, alerts: "Find the user, please check the email"});
      }else{
        console.log("Cannot find the user!");
        res.json({resetSuccess:false, alerts: "Cannot find the user!"});
      } 
    }
  });
};

module.exports.resetSuccess = async (req, res) => {
    res.render("resetpasswordSuccess.ejs");
};
module.exports.resetSuccess2 = async (req, res) => {
  const refererUrl = req.headers.referer;
  const parsedUrl = url.parse(refererUrl, true);
  const token = parsedUrl.query.token;

  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("query:", req.query);
  const { password, confirmedpassword } = req.body;
  if (token == process.env.API_KEY) {
    const useremail = process.env.USER_EMAIL;

    User.changePassword(useremail, password)
      .then(() => {
        console.log("Password updated successfully");
        res.json({ resetsuccess: false, alerts: "Update Password successfully" });
      })
      .catch((err) => {
        console.error("Error updating password:", err);
        res.json({ resetsuccess: false, alerts: "error happened when update password" });
      });
  } else {
    res.json({ resetsuccess: false, alerts: "Token is not correct" });
    console.log(req.headers.referer + " token: " + process.env.API_KEY);
  }
};

module.exports.checkuser = async (req, res) => {

          const checkCredentials = async (foundResult, password) => {
              const isMatch = await bcrypt.compare(password, foundResult.password);
              
              return isMatch;           
          };


          const { email, password } = req.body;
  
          User.FindUser(email, async (err, user) =>{
                  if(err){
                    console.log("Error happened when find the user");
                    res.json({ loginSuccess: false });
                  }else{
                    if(user){
                      const isvalid = await checkCredentials(user,password);
                      console.log("The promise?" + isvalid);
                      if(isvalid)
                      {
                        console.log("Find the user email!!!");
                        req.session.loginstatus = true;
                        req.session.userid = user._id;
                        console.log("Find the user email!!!" + req.session.userid + " " + req.session.loginstatus);
                        res.json({ loginSuccess: true, userid: email});
                      }
                      else
                      {
                        console.log("Wrong password");
                        res.json({ loginSuccess: false });
                      }
                    }
                    else{
                      console.log("No such user");
                      res.json({ loginSuccess: false });
                    }


                  }

            });
       
    };