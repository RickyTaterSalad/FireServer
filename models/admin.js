var mongoose = require("mongoose");

var AdminSchema = new mongoose.Schema({
    email: {
        type: mongoose.Schema.Types.String,
        required: true

    }

});
AdminSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        return {};
    }
});


var Admin = mongoose.model('Admin', AdminSchema);
module.exports = {
    Admin: Admin
};