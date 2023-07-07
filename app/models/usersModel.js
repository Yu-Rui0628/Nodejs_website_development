
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { ObjectID, ObjectId } = require('mongodb');
const { Console } = require('console');

var UserSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  // Add more fields here as necessary
  phonelist: [Object]
},{strict:false}
);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'a1321157243@gmail.com',
    pass: 'djpdnuftldfvobtb'
  }
});

function generateRandomToken() {
  return crypto.randomBytes(16).toString('hex');
};

UserSchema.statics.sendEmailVerification = function (req, res, email, link) {
    const token = generateRandomToken();
    process.env.API_KEY = token;

    const mailOptions = {
      from: 'a1321157243@gmail.com', 
      to: email,
      subject: 'Email Validation',
      text: `Please validate your email by clicking the link below:\n\nhttp://${req.headers.host}/${link}?token=${token}`
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        res.status(500).send('Error sending email validation');
      } else {
        console.log('Email sent:', info.response);
        res.status(200).send('Email validation sent');
      }
    });
  };

UserSchema.statics.FindUser = async function(email, callback) {
    this.findOne({ email: email }, callback);
};

//find user by id
UserSchema.statics.FindUserById = function(id, callback) {
  return this.findById(id)
  .exec(callback);
};

UserSchema.statics.createUser = async function (userData, callback) {
    // hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
  
    // Create a new user object with hashed password
    const newUser = new this({
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      password: hashedPassword,
    });
  
    // Save the new user to the database
    newUser.save(callback);
  };

  UserSchema.statics.changePassword = async function (email, newPassword, callback) {
    // Find the user by their email
    await this.findOne({email: email}, async (err, user) => {
        if(err){
          console.log("Cannot find user");
        }else{
          if(user){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
          
            // Update the user's password
            user.password = hashedPassword;
            await this.findOneAndUpdate({ email }, { password: hashedPassword });
          }else{
            return callback('User not found', 'Great');
          }
        }
    });
};


UserSchema.statics.updateUser = async function (id, updatedUser, callback) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    // Proceed with updating the document
    try {
      const filter = {_id: id};
  
      // Perform the update
      const result = await this.updateOne(filter, updatedUser);
  
      console.log('User details updated:', result.nModified);
    } catch (err) {
      console.error('Error updating user details:', err);
    }
  } else {
    console.error('Invalid ObjectId');
  }
  
}

UserSchema.statics.comparePassword = async function (id, newPwd) {
  //console.log("2"+id);
    const salt = await bcrypt.genSalt(10);
    let user;
    let isMatch;
    const result = await this.findOne({ _id: new ObjectId(id) }).exec();
    user = result;
    //console.log(user.password);
    var newpwd = await bcrypt.hash(newPwd.currentPassword, salt);
    //console.log(newpwd);
    await bcrypt.compare(newPwd.currentPassword, user.password)
    .then(match => {
      isMatch = match;
    });
    if (isMatch) {
      //console.log(isMatch);
      return {match:isMatch,email:user.email};
    } else { 
      //console.log(isMatch);
      return  {match:isMatch,email:user.email};
    }
}

UserSchema.statics.addNewPhone = async function (id, newPhone) {
  let user;
  const result = await this.findById(id).exec();
  user = result;
  //console.log(user);
  if (user) {
    let update = {};
    update = { $push: { phonelist: newPhone } };

    //console.log(update);
    //Update the user in the database
    const filter = {_id: id};

    try{
    
      const updateResult = await this.updateOne(filter, update);
    
    console.log('User phonelist updated:' + updateResult.nModified);
    } catch (err) {
      console.error('Error updating user details:', err);
    }
  } else {
    console.log("User not found.");
  }
}

const userlist = mongoose.model('userlists', UserSchema);
module.exports = userlist;

