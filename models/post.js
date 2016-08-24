var mongoose = require("mongoose");
var util = require("util");

var config = require('config');
var deptId = config.get('workingDepartment');

var platoons = config.get(util.format('departments.%s.platoons', deptId));

var PostSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        "ref": "Account",
        required: true
    },
    shift: {
        type: mongoose.Schema.Types.Date,
        required: true,
        validate: {
            validator: function (d) {
                return d > Date.now()
            },
            message: 'shift cannot be in the past!'
        }
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        index: true,
        required: true
    },
    station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station",
        index: true,
        required: true
    },
    isTrade: {
        type: mongoose.Schema.Types.Boolean
    },
    isOvertime: {
        type: mongoose.Schema.Types.Boolean
    },
    isAssignedHire: {
        type: mongoose.Schema.Types.Boolean
    },
    isRegular: {
        type: mongoose.Schema.Types.Boolean
    },
    requestType: {
        type: mongoose.Schema.Types.String,
        lowercase: true,
        enum: ["off", "on"],
        required: true
    },
    platoon: {
        type: mongoose.Schema.Types.String,
        index: true,
        uppercase: true,
        enum: platoons,
        required: true
    }
}, {timestamps: true});


PostSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        var obj =  {
            id: ret._id,
            creator: ret.creator,
            shift: ret.shift,
            department: ret.department,
            station: ret.station,
            requestType: ret.requestType,
            platoon: ret.platoon
        };
        if(ret.isTrade){
            obj.isTrade = true;
        }
        if(ret.isOvertime){
            obj.isOvertime = true;
        }
        if(ret.isAssignedHire){
            obj.isAssignedHire = true;
        }
        if(ret.isRegular){
            obj.isRegular = true;
        }
        return obj;
    }
});



var Post = mongoose.model('Post', PostSchema);

module.exports = {
    Post: Post
};