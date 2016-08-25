//model types passed can be either the instance itself or the object id

var findById = function (/*ObjectId*/ id) {

};

var findByAccount = function (/*Account*/ user) {

};
var findByCreator = function (/*Account*/ user) {

};
var findByRecipient = function (/*Account*/ user) {

};

module.exports = {
    findById: findById,
    findByAccount: findByAccount,
    findByCreator: findByCreator,
    findByRecipient: findByRecipient
};