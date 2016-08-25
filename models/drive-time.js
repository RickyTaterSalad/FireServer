var mongoose = require("mongoose");

var config = require('config');
var units = config.get('driveTimes.units');

var DriveTimeSchema = new mongoose.Schema({
    originStation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        //todo change once we get stations
        required: false
    },
    destinationStation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        //todo change once we get stations
        required: false
    },
    originAddress: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    destinationAddress: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    distanceStringMetric: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    distanceStringImperial: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    distanceMeters: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    distanceFeet: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    duration: {
        type: mongoose.Schema.Types.Number,
        required: true
    }


});
DriveTimeSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        var obj = {
            originStation: ret.originStation,
            destinationStation: ret.destinationStation,
            originAddress: ret.originAddress,
            destinationAddress: ret.destinationAddress,
            duration: ret.duration
        };
        if (units == "metric") {
            obj.distanceString = ret.distanceStringMetric;
            obj.distance = ret.distanceMeters;

        }
        else {
            obj.distanceString = ret.distanceStringImperial;
            obj.distance = ret.distanceFeet;

        }
    }
});


var DriveTime = mongoose.model('DriveTime', DriveTimeSchema);
module.exports = {
    DriveTime: DriveTime
};