var mongoose = require('mongoose');

var all = function (model) {
    if (!model) {
        return Promise.resolve([]);
    }
    return model.find();
};
var byId = function (model, id) {

    if (!id || !model || !mongoose.Types.ObjectId.isValid(id)) {
        return Promise.resolve(null);
    }
    return model.findOne(id);
};

module.exports = {
    all: all,
    byId: byId
};