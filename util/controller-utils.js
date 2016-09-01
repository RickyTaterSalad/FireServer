var Promise = require("bluebird");
var debug = require('debug')('fireServer:server');
var getRandomDocumentFromModel = function (model,options) {
    return Promise.try(function () {
        return model.count().exec();
    }).then(function (count) {
        return Math.floor(Math.random() * count);
    }).then(function (random) {
        if(options && options.populate){
            return model.findOne().skip(random).populate(options.populate).exec();
        }
        else {
            return model.findOne().skip(random).exec();
        }
    }).then(function (res) {
        return  res;

    }).catch(function(err){
        debug("err retrieving random document for model: " + model.modelName);
    });
};

var all = function(model){
    if (!model) {
        Promise.resolve([]);
    }
    return model.find();
};
var byId = function(model,id){
    if (!id || !model) {
        Promise.resolve(null);
    }
    return model.findById(id);
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
    getRandomDocument: getRandomDocumentFromModel,
    all: all,
    byId: byId
};
