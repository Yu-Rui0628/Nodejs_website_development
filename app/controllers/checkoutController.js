const Phone = require('../models/phonesModel');



function getStockByName(data, name) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].name == name) {
        return data[i].stock;
      }
    }
    return null;
  }
function clearSessionProperties(session) {
    for (const key in session) {
      if (key.startsWith('cart') || key.startsWith('stock')) {
        delete session[key];
      }
    }
  }
module.exports.deleteSession = async function(req,res){
    const removeSession = req.body.removeSession;
    let idlist = [];
    for (let i = 0; i<removeSession.length; i++){
        const cartId = removeSession[i].id; 
        const sessionKey = 'cart' + cartId;
        delete req.session[sessionKey];

    }
    res.json(req.session);
}

module.exports.home = async function(req, res) {
    const sessionData = req.session;
    const promises = [];
    var items = [];
    if (Object.keys(req.session).length === 0) {
        console.log('Session is empty');
        res.render('checkout.ejs', {items});
      }else{
        const cartItemIds = Object.keys(sessionData).filter(key => key.startsWith('cart'));
        cartItemIds.forEach((item)=>{
        const promise = new Promise((resolve, reject) => {
        Phone.findphonenamebyid(item.substring(4),(err, phone)=>{

            if(err){
                console.log("error");
                reject(err);
            }else{
                if(phone){
                    // console.log("Phone title " + phone.title);
                    // console.log("Phone stock " + phone.stock);
                    if(sessionData[[item]] == 0)
                    {
                        console.log("");

                    }else{
                        items.push({name:phone.title, quantity:sessionData[[item]], stock: phone.stock, price: phone.price, id: phone._id});
                    }
                    
                    resolve();

                }else{
                    console.log("cannot find phone");
                    reject("cannot find phone");
                }
            }
        })});
        promises.push(promise);
    })

    try {
        await Promise.all(promises);
        const loginstatus = sessionData.loginstatus;
       
        res.render('checkout.ejs', {items,loginstatus});

         
    } catch (error) {
        console.log(error);
    }


      }
    
};




module.exports.confirm = async function(req, res) {
    let items = req.body;
    let outofstock = false;
    let errorback = [];
    let collection = [];
    let stopIteration = false;
    const confirmPhonePromises = [];
    items.forEach((item) => {
        
        confirmPhonePromises.push(
            new Promise((resolve, reject) => {
                
            Phone.confirmPhoneNumber(item["name"], (err, phone) => {
                if (err) {
                console.log("Cannot Find Phone");
                reject(err);
                } else {
                if (parseInt(item["quantity"]) > phone.stock) {
                    console.log("Failed User");
                    errorback.push({ name: item["name"] });
                    outofstock = true;
                    reject(new Error("Something wrong" + outofstock));
                } else {
                    console.log("success");
                    let newn = phone.stock - parseInt(item["quantity"]);
                    collection.push({ name: item["name"], stock: newn });

                    resolve();
                }
                }
            });
            })
        );
});

try {
    await Promise.all(confirmPhonePromises).catch(error => {
        console.log('Promise.all error: ', error);
        res.json({error:errorback});
    });

    if (outofstock) {
        console.log("OUT OF STOCK  " + outofstock);
       
      
    } else {

        var pro = [];
  
        for (let i = 0; i < items.length; i++) {
            console.log("new stock " + items[i]["name"] + "The latest " + collection[i].newn);
            Phone.setStock(items[i]["name"], getStockByName(collection, items[i].name));
        }

        clearSessionProperties(req.session);


        res.json({ message: "Success", alert: "Success confirmed"});
    }
} catch (error) {
    console.log(error);
}

};