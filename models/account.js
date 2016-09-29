var mongoose = require("mongoose");
var util = require('util');
var config = require('config');
var deptId = config.get('workingDepartment');
var validator = require('validator');

var platoons = config.get(util.format('departments.%s.platoons', deptId));

var AccountSchema = new mongoose.Schema({
    localAuthUid: {
        type: mongoose.Schema.Types.String,
        index: true
    },
    googleUid: {
        type: mongoose.Schema.Types.String,
        index: true
    },
    facebookUid: {
        type: mongoose.Schema.Types.String,
        index: true
    },
    isSoftBanned: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    isPermaBanned: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    isVouchedFor: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    firstName: {
        type: mongoose.Schema.Types.String,
        required: [true, 'User must have a First name']
    },
    photo: {
        type: mongoose.Schema.Types.String
    },
    lastName: {
        type: mongoose.Schema.Types.String,
        required: [true, 'User must have a Last name']
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: [true, 'User email is required.'],
        validate : {
            validator: function (email) {
                return validator.isEmail(email);
            },
            message: 'Invalid email address.'
        }
    },
    platoon: {
        type: mongoose.Schema.Types.String,
        index: true,
        uppercase: true,
        enum: platoons
    },
    //todo - validate the assigned hire code exists for the dept.
    assignHireCode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AssignHireCode"
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"//,
     //   required: [true, 'User must be associated with a department.']
    },
    station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station"
    },
    rank: {
        type : mongoose.Schema.Types.String,
        index : true,
        uppercase : true
    },
    conversations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    }],
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]

}, {timestamps: true});

AccountSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        return {
            id: ret._id,
            firstName: ret.firstName,
            photo: ret.photo,
            lastName: ret.lastName,
            platoon: ret.platoon,
            assignedHireCode: ret.assignedHireCode,
            rank: ret.rank,
         //   posts: ret.posts,
         //   department: ret.department,
            station: ret.station
        };
    }
});


var Account = mongoose.model('Account', AccountSchema);


module.exports = {
    Account: Account

};
