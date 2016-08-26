var mongoose = require("mongoose");

var ShiftSchema = new mongoose.Schema({
    start : {
        type : mongoose.Schema.Types.Date,
        required : true
    },
    hours : {
        type : mongoose.Schema.Types.Number,
        required : true
    },
    platoon : {
        type : mongoose.Schema.Types.String,
        required : true
    }
});

ShiftSchema.set('toJSON', {
    transform : function(doc, ret, options){
        return {
            start : ret.start,
            hours : ret.hours
        };
    }
});

var AssignHireCodeSchema = new mongoose.Schema({
    ahCode : {
        type : mongoose.Schema.Types.String,
        required : true,
        //TODO need case insensitive validator
        unique : true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        "ref": "Department",
        required: true
    },
    shifts : [ShiftSchema]
});

AssignHireCodeSchema.set('toJSON', {
    transform : function(doc, ret, options){
        return {
            ahCode : ret.ahCode,
            department : ret.department,
            shifts : ret.shifts
        };
    }
});

var AssignHireCode = mongoose.model('AssignHireCode', AssignHireCodeSchema);

module.exports = {
    AssignHireCode: AssignHireCode
};
