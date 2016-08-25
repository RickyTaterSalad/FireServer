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
    ah_code : {
        type : mongoose.Schema.Types.String,
        required: true
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
            code : ret.ah_code,
            department : ret.department,
            shifts : ret.shifts
        };
    }
});

var AssignHireCode = mongoose.model('AssignHireCode', AssignHireCodeSchema);

module.exports = {
    AssignHireCode: AssignHireCode
};
