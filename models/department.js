var mongoose = require("mongoose");

var ScheduleSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String
    },
    numberOfPlatoons: {
        type: mongoose.Schema.Types.Number,
        required: [true, 'Department must have schedule number of platoons']
    },
    platoonSchedule: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Department must have a schedule platoon schedule']
    },
    shiftLengthInHours: {
        type: mongoose.Schema.Types.Number,
        required: [true, 'Department must have a schedule shift length']
    },
    shiftStartTime: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Department must have a schedule start time']
    },
    platoonScheduleStartDate: {
        type: "Moment",
        required: [true, 'Department must have a platoon schedule start date']
    },
    platoonColorCodes: [{
        platoon: {
            type: mongoose.Schema.Types.String,
            required: true
        },
        hexColor: {
            type: mongoose.Schema.Types.String,
            required: true
        }
    }]
});

ScheduleSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        var obj = {
            name: ret.name,
            numberOfPlatoons: ret.numberOfPlatoons,
            platoonSchedule: ret.platoonSchedule.split(","),
            shiftLengthInHours: ret.shiftLengthInHours,
            shiftStartTime: ret.shiftStartTime,
            platoonScheduleStartDate: ret.platoonScheduleStartDate
        };

        if (ret.platoonColorCodes) {
            obj.platoonColorCodes = {};
            for (var i = 0; i < ret.platoonColorCodes.length; i++) {
                obj.platoonColorCodes[ret.platoonColorCodes[i].platoon] = ret.platoonColorCodes[i].hexColor;
            }
        }

        return obj;
    }
});

var DepartmentSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: [true, "Department must have a name"]
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