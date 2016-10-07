var mongoose = require("mongoose");

var ShiftSchema = new mongoose.Schema({
    start : {
        type : 'Moment',
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
        required : [true, 'AH Code object must have a specified code'],
        uppercase : true,
        unique : true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        "ref": "Department",
        required: [true, "AH Code must be associated with a department."]
    },
    shifts : [ShiftSchema]
});

AssignHireCodeSchema.set('toJSON', {
    transform : function(doc, ret, options){
        return {
            id : ret._id,
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
