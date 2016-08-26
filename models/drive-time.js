var mongoose = require("mongoose");

var config = require('config');
var units = config.get('driveTimes.units');

var LocationObject = new mongoose.Schema({
    type: {
        type: String,
        default: 'Point'
    },
    coordinates: [
        [
            {type: [Number]}
        ]
    ]

});


var DriveTimeSchema = new mongoose.Schema({
    originStation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        //todo change once we get stations
        required: false,
        index: true
    },
    originCoordinate: {type: LocationObject, index: '2dsphere'},
    destinationCoordinate: {type: LocationObject, index: '2dsphere'},
    destinationStation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        //todo change once we get stations
        required: false,
        index: true

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
            destinationCoordinate: ret.destinationCoordinate,
            originCoordinate: ret.originCoordinate,
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
        return obj;
    }
});


var DriveTime = mongoose.model('DriveTime', DriveTimeSchema);
module.exports = {
    DriveTime: DriveTime
};