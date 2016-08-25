var mongoose = require("mongoose");
var util = require('util');
var config = require('config');
var deptId = config.get('workingDepartment');
var platoons = config.get(util.format('departments.%s.platoons', deptId));

var AccountSchema = new mongoose.Schema({
    localAuthUid: {
        type: mongoose.Schema.Types.String
    },
    googleUid: {
        type: mongoose.Schema.Types.String
    },
    isSoftBanned: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    isPermaBanned: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    firstName: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    photo: {
        type: mongoose.Schema.Types.String
    },
    lastName: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    //todo - validate platoon exists on the department
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
        ref: "Department"
    },
    station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station"
    },
    conversations: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    }

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
            department: ret.department,
            station: ret.station,
            conversations: ret.conversations
        };
    }
});


var Account = mongoose.model('Account', AccountSchema);


module.exports = {
    Account: Account

};
