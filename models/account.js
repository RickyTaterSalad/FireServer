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
<<<<<<< HEAD
    AssignHireCode: {
=======
    assignedHireCode: {
>>>>>>> 840b9646361e15930b0fcb5fb4c44be2af574eae
        type: mongoose.Schema.Types.String
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
var Account = mongoose.model('Account', AccountSchema);


module.exports = {
    Account: Account

};
