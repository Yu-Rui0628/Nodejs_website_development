const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

var phoneSchema = new mongoose.Schema(
  {
    title: String,
    brand: String,
    image: String,
    seller: String,
    price: Number,
    stock: Number,
    reviews: [Object],
    disabled: String
  },{strict:false}
);


//find by ID
phoneSchema.statics.findId = function(id, callback){
 

  return this.findById(id)
  .exec(callback)
  }

//find by brand
phoneSchema.statics.findBrand = function(brand, callback){

return this.find({'brand':brand})
.exec(callback)
}


//find by title 
phoneSchema.statics.findTitle = function(title, callback){
  const regex = new RegExp(title, 'i');

  return this.find({'title':{ $regex: regex },'disabled': { $exists: false } })
  .exec(callback)
}

//find by title and brand
phoneSchema.statics.findTitleAndBrand = function(title,brand, callback){
  const regexTitle = new RegExp(title, 'i');
  const regexBrand = new RegExp(brand, 'i');

  return this.find({'brand':{ $regex: regexBrand },'title':{ $regex: regexTitle },'disabled': { $exists: false } })
  .exec(callback)
}

//find by title and brand and maximum price
phoneSchema.statics.findTitleAndBrandAndMaximum = function(title,brand,maximum, callback){
  const regexTitle = new RegExp(title, 'i');
  const regexBrand = new RegExp(brand, 'i');

  return this.find({'price':{$lte: maximum },'brand':{ $regex: regexBrand },'title':{ $regex: regexTitle },'disabled': { $exists: false } })
  .exec(callback)
}

//find five the least quantity available
phoneSchema.statics.findLeastQuantity = function(callback){

return this.find({'stock':{$gt:0},'disabled': { $exists: false }})
.sort({'stock':+1})
.limit(5)
.exec(callback);
}


//find five highest average ratings
phoneSchema.statics.findHighestRating = function(callback){

  return this.aggregate([
    {$match: { "disabled":{ $exists: false },
      $expr: {
        $gte: [{ $size: { $ifNull: ["$reviews", []] } }, 2]
        }
      }
    },
    { $unwind: "$reviews" },
    {
      $group: {
        _id: "$_id",
        image: { $addToSet: "$image" },
        title: { $addToSet: "$title" },
        price: { $addToSet: "$price" },
        
        avgRating: { $avg: "$reviews.rating" }
      }
    },
    {
      $sort: { "avgRating": -1 }
    },
    {
      $limit: 5
    }
  ]).exec(callback)
}

phoneSchema.statics.addNewComment = async function(itemId,reviewData){
  
  
  
  var phone = await this.findById(itemId).exec();

  if (phone){
    let update = {};
    const filter = {_id: itemId};

    update = { $push: { reviews: reviewData } };
    try{
    
      const updateResult = await this.updateOne(filter, update);
      
    
    } catch (err) {
      console.error('Error updating user details:', err);
    }
  }
}

//add new phone
phoneSchema.statics.addNewPhone = function(userId, newPhoneUser){
  var findImg;
  //console.log(newPhoneUser.brand);
  switch (newPhoneUser.brand) {
    case 'Apple':
      findImg = "images/Apple.jpeg";
      break;
    case 'BlackBerry':
      findImg = "images/BlackBerry.jpeg";
      break;
    case 'HTC':
      findImg = "images/HTC.jpeg";
      break;
    case 'Huawei':
      findImg = "images/Huawei.jpeg";
      break;
    case 'LG':
      findImg = "images/LG.jpeg";
      break;
    case 'Motorola':
    findImg = "images/Motorola.jpeg";
    break;
    case 'Nokia':
      findImg = "images/Nokia.jpeg";
      break;
    case 'Samsung':
      findImg = "images/Samsung.jpeg";
      break;
    case 'Sony':
      findImg = "images/Sony.jpeg";
      break;
  }
  //console.log(findImg);

  const newPhone = new phones({
    title: newPhoneUser.phoneTitle,
    brand: newPhoneUser.brand,
    image: findImg,
    stock: newPhoneUser.quantity,
    seller: userId,
    price: newPhoneUser.price,
    reviews: []
  });

  //save the new phone into the database
  newPhone.save((err, savedPhone) => {
    if (err) {
      console.error(err);
    } else {
      console.log('New Phone added:', savedPhone);
    }
  });

}

phoneSchema.statics.getUserPhones = function(userId, callback){
  const regexId = new RegExp(userId, 'i');
  return this.find({'seller':{$regex: regexId}})
  .exec(callback);
}

//find average rating
phoneSchema.statics.findAverageRating = function(_id, callback){
  const id = new ObjectId(_id);

  return this.aggregate([
    {$match: { "_id":id ,}
    },
    { $unwind: "$reviews" },
    {
      $group: {
        _id: "$_id",
        image: { $addToSet: "$image" },
        title: { $addToSet: "$title" },
        price: { $addToSet: "$price" },
        
        avgRating: { $avg: "$reviews.rating" }
      }
    },
    {
      $addFields: {
        avgRating: {
          $round: ["$avgRating", 2]
        }
      }
    }
  ]).exec(callback)
}

phoneSchema.statics.disable = async function(phoneId){
  let phone;
  const result = await this.findById(phoneId).exec();
  phone = result;

  if (phone) {
    let update = {};
    update = { $set: { disabled: "" } };

    //Update the phone in the database
    const filter = {_id: phoneId};

    try{
    
      await this.updateOne(filter, update);
    
    console.log('phone: ' + phone.title + " has been disabled");
    } catch (err) {
      console.error('Error disabling a phone:', err);
    }
  } else {
    console.log("Phone not found.");
  }
}

phoneSchema.statics.enable = async function(phoneId){
  let phone;
  const result = await this.findById(phoneId).exec();
  phone = result;

  if (phone) {
    let update = {};
    update = { $unset: { disabled: "" } };

    //Update the phone in the database
    const filter = {_id: phoneId};

    try{
    
      await this.updateOne(filter, update);
    
    console.log('phone: ' + phone.title + " has been enabled");
    } catch (err) {
      console.error('Error enabling a phone:', err);
    }
  } else {
    console.log("Phone not found.");
  }
}

phoneSchema.statics.remove = async function(phoneId){
  let phone;
  const result = await this.findById(phoneId).exec();
  phone = result;
  if (phone) {
    this.deleteOne({ _id: phoneId }, function(err, result) {
      if (err) throw err;
  
      console.log('Phone(s) deleted');
    });
  } else {
    console.log("Phone not found.");
  }
}

phoneSchema.statics.confirmPhoneNumber = async function(phonename,callback){
  this.findOne({title:phonename},callback);
}


phoneSchema.statics.setStock = async function(phonename, newStockValue) {
  let phone = await this.findOneAndUpdate(
      { title: phonename }, 
      { $set: { stock: newStockValue } }, 
      { new: true } // this option returns the updated document
  );

  return phone;
}

phoneSchema.statics.findphonenamebyid = function(id,callback) {
  this.findOne({_id:id},callback);
};


var phones = mongoose.model('phonelists', phoneSchema);
module.exports = phones;
