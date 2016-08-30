

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
    return model.findOne(id);
};

module.exports = {
    all: all,
    byId: byId
}