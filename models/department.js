var mongoose = require("mongoose");

var DepartmentSchema = new mongoose.Schema({
    Name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    Platoons: [{
        type: mongoose.Schema.Types.String,
        uppercase: true
    }],
    Schedule: {
        "Name": {type: mongoose.Schema.Types.String},
        "NumberOfPlatoons": {type: mongoose.Schema.Types.Number},
        "PlatoonSchedule": {type: mongoose.Schema.Types.String},
        "ShiftLengthInHours": {type: mongoose.Schema.Types.Number},
        "ShiftStartTime": {type: mongoose.Schema.Types.String}
    },
    Stations: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Station'}
    ]
});

var Department = mongoose.model('Department', DepartmentSchema);

module.exports = {
    Department: Department
};