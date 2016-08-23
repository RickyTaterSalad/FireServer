var mongoose = require("mongoose");
var util = require('util');
var config = require('config');
var deptId = config.get('workingDepartment');
var platoons = config.get(util.format('departments.%s.platoons', deptId));

var AccountSchema = new mongoose.Schema({
    LocalAuthUid: {
        type: mongoose.Schema.Types.String
    },
    GoogleUid: {
        type: mongoose.Schema.Types.String
    },
    FirstName: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    Photo: {
        type: mongoose.Schema.Types.String
    },
    LastName: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    Email: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    //todo - validate platoon exists on the department
    Platoon: {
        type: mongoose.Schema.Types.String,
        index: true,
        uppercase: true,
        enum: platoons
    },
    //todo - validate the assigned hire code exists for the dept.
    AssignedHireCode: {
        type: mongoose.Schema.Types.String
    },
    Department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    Station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station"
    }

}, {timestamps: true});
var Account = mongoose.model('Account', AccountSchema);


module.exports = {
    Account: Account

};