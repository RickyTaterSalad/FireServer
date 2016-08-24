var mongoose = require("mongoose");

var AssignHireCodeSchema = new mongoose.Schema({
    ah_code : {
        type : mongoose.Schema.Types.String,
        required = true;
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        "ref": "Department",
        required: true
    },
    shifts : [Shift]
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

var Shift = new mongoose.Schema({
    start : {
        type : mongoose.Schema.Types.Date,
        required = true;
    },
    end : {
        type : mongoose.Schema.Types.Date,
        required = true;
    }
});

var AssignHireCode = mongoose.model('AssignHireCode', AssignHireCodeSchema);

module.exports = {
    AssignHireCode: AssignHireCode
};
