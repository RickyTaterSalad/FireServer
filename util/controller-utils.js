var Promise = require("bluebird");

var getRandomDocumentFromModel = function (model) {
    return Promise.try(function () {
        return model.count().exec();
    }).then(function (count) {
        return Math.floor(Math.random() * count);
    }).then(function (random) {
        return model.findOne().skip(random).exec();
    }).then(function (res) {
        return  res;

    }).catch(function(err){
        console.log("err retrieving random document for model: " + model.modelName);
    });
};

/*

 var Promise = require("bluebird");

 var getRandomDocumentFromModel = function (model) {
 return new Promise(function (resolve, reject) {
 model.count().exec(function (err, count) {
 var random = Math.floor(Math.random() * count);
 model.findOne().skip(random).exec(
 function (err, result) {
 return err ? reject(err) : resolve(result);
 });
 });
 });
 };
 module.exports = {
 getRandomDocument: getRandomDocumentFromModel
 };


 */

module.exports = {
    getRandomDocument: getRandomDocumentFromModel
};
