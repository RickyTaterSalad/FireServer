var mongoose = require("mongoose");
var util = require("util");

var config = require('config');
var deptId = config.get('workingDepartment');
var moment = require("moment");
var dateUtils = require("../util/date-utils");


var platoons = config.get(util.format('departments.%s.platoons', deptId));

var PostSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        "ref": "Account",
        required: true,
        index: true
    },
    claimant: {
        type: mongoose.Schema.Types.ObjectId,
        "ref": "Account"
    },
    claimantHasConfirmed: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
        required: true
    },
    shift: {
        type: "Moment",
        required: true,
        validate: {
            validator: function (d) {
                if (!d) {
                    return false;
                }
                return !dateUtils.isDateBeforeToday(moment(d));
            },
            message: 'shift cannot be in the past!'
        }
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        index: true,
        required: true
    },
    station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station",
        index: true,
        required: true
    },
    isTrade: {
        type: mongoose.Schema.Types.Boolean
    },
    isOvertime: {
        type: mongoose.Schema.Types.Boolean
    },
    isAssignedHire: {
        type: mongoose.Schema.Types.Boolean
    },
    isRegular: {
        type: mongoose.Schema.Types.Boolean
    },
    comments: {
        type: mongoose.Schema.Types.String
    },
    requestType: {
        type: mongoose.Schema.Types.String,
        lowercase: true,
        enum: ["off", "on"],
        required: true
    },
    shiftStartTime: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Post must have a shift start time']
    },
    platoon: {
        type: mongoose.Schema.Types.String,
        index: true,
        uppercase: true,
        enum: platoons,
        required: true
    },
    archived:{
        type: mongoose.Schema.Types.Boolean,
        default: false,
        required: true,
        index: true
    }
}, {timestamps: true});


PostSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        var created = moment(ret.createdAt);

        var obj = {
            id: ret._id,
            creator: ret.creator,
            shift: ret.shift,
            comments: ret.comments,
            shiftStartTime: ret.shiftStartTime,
            requestType: ret.requestType,
            platoon: ret.platoon,
            created: created.valueOf()
        };
        if (ret.creator && ret.creator.station) {
            obj.creator = {
                id: ret.creator.id,
                firstName: ret.creator.firstName,
                lastName: ret.creator.lastName,
                platoon: ret.creator.platoon,
                photo: ret.creator.photo
            }
        }
        else {
            obj.creator = ret.creator;
        }

        if (ret.station && ret.station.stationNumber) {
            obj.station = {
                stationNumber: ret.station.stationNumber,
                id: ret.station.id
            }
        }
        else {
            obj.station = ret.station;
        }

        if (ret.isTrade) {
            obj.isTrade = true;
        }
        if (ret.isOvertime) {
            obj.isOvertime = true;
        }
        if (ret.isAssignedHire) {
            obj.isAssignedHire = true;
        }
        if (ret.isRegular) {
            obj.isRegular = true;
        }
        obj.claimed = ret.claimantHasConfirmed && ret.claimant;
        return obj;
    }
});


var Post = mongoose.model('Post', PostSchema);

module.exports = {
    Post: Post
};