var mongoose = require("mongoose");

var ScheduleSchema = new mongoose.Schema({
    name: {type: mongoose.Schema.Types.String},
    numberOfPlatoons: {type: mongoose.Schema.Types.Number},
    platoonSchedule: {type: mongoose.Schema.Types.String},
    shiftLengthInHours: {type: mongoose.Schema.Types.Number},
    shiftStartTime: {type: mongoose.Schema.Types.String}
});

ScheduleSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        return {
            name: ret.name,
            numberOfPlatoons: ret.numberOfPlatoons,
            platoonSchedule: ret.platoonSchedule,
            shiftLengthInHours: ret.shiftLengthInHours,
            shiftStartTime: ret.shiftStartTime
        }
    }
});

var DepartmentSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    platoons: [{
        type: mongoose.Schema.Types.String,
        uppercase: true
    }],
    schedule: ScheduleSchema

});
DepartmentSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        return {
            id: ret._id,
            name: ret.name,
            platoons: ret.platoons,
            schedule: ret.schedule
        };

    }
});
var Department = mongoose.model('Department', DepartmentSchema);

module.exports = {
    Department: Department
};