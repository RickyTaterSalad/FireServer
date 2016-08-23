var mongoose = require("mongoose");
var config = require('config');
var util = require('util');

var deptId = config.get('workingDepartment');
var platoons = config.get(util.format('departments.%s.platoons', deptId));

var UserSchema = new mongoose.Schema({
    FirstName: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    LastName: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    //todo - validate platoon exists on the department
    Platoon: {
        type: mongoose.Schema.Types.String,
        index: true,
        uppercase: true,
        enum: platoons,
        required: true
    },
    //todo - validate the assigned hire code exists for the dept.
    AssignedHireCode: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    Department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true
    },
    Station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station",
        required: true
    }
}, {timestamps: true});

var User = mongoose.model('User', UserSchema);

module.exports = {
    User: User
};