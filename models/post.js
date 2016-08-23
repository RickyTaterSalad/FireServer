var mongoose = require("mongoose");
var util = require("util");

var config = require('config');
var deptId = config.get('workingDepartment');

var platoons = config.get(util.format('departments.%s.platoons', deptId));

var PostSchema = new mongoose.Schema({
    Creator: {
        type: mongoose.Schema.Types.ObjectId,
        "ref": "User",
        required: true
    },
    Shift: {
        type: mongoose.Schema.Types.Date,
        required: true,
        validate: {
            validator: function (d) {
                return d > Date.now()
            },
            message: 'shift cannot be in the past!'
        }
    },
    Station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station",
        index: true,
        required: true
    },
    IsTrade: {
        type: mongoose.Schema.Types.Boolean
    },
    IsOvertime: {
        type: mongoose.Schema.Types.Boolean
    },
    IsAssignedHire: {
        type: mongoose.Schema.Types.Boolean
    },
    IsRegular: {
        type: mongoose.Schema.Types.Boolean
    },
    RequestType: {
        type: mongoose.Schema.Types.String,
        lowercase: true,
        enum: ["off", "on"],
        required: true
    },
    Platoon: {
        type: mongoose.Schema.Types.String,
        index: true,
        uppercase: true,
        enum: platoons,
        required: true
    }
}, {timestamps: true});

var Post = mongoose.model('Post', PostSchema);

module.exports = {
    Post: Post
};