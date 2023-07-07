const phoneList = require('../models/phonesModel');

module.exports.searchIndex = async function(req, res) {
    var sess = req.session;
    
    if ("loginstatus" in sess) {
        
        var loginstatus = sess.loginstatus ;
        
    } else{
       
        sess.loginstatus = false;
        var loginstatus = false;
    }

    searchData = req.query.search;
    if (searchData == null){
        searchData = "";
    }
    brandData = "";

    maximumData = 1000000;


    searchList = await new Promise((resolve, reject) => {
        phoneList.findTitleAndBrandAndMaximum(searchData,brandData,maximumData,(err, result) => {
            if (err) {
                reject("Cannot find");
            } else {
                resolve(result);
            }
        });
    });

    res.render('search.ejs',{'searchList':searchList,'loginstatus':loginstatus});

};


module.exports.searchData = async function(req, res) {
    
    
    var searchData = req.query.search;
    var brandData = req.query.brand;
    var maximumData = req.query.maximum;
    if (typeof searchData === "undefined"){
        searchData = "";
    }
    if (typeof brandData === "undefined"){
        brandData = "";
    }
    if (typeof maximumData === "undefined"){
        maximumData = 1000000;
    }

    
    searchList = await new Promise((resolve, reject) => {
        phoneList.findTitleAndBrandAndMaximum(searchData,brandData,maximumData,(err, result) => {
            if (err) {
                reject("Cannot find");
            } else {
                resolve(result);
            }
        });
        
    });

    res.json(searchList);


};