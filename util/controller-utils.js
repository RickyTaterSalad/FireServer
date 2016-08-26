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
