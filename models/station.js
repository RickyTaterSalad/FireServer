var mongoose = require("mongoose");
var config = require('config');
var util = require('util');
var units = config.get('driveTimes.units');

var deptId = config.get('workingDepartment');
var platoons = config.get(util.format('departments.%s.platoons', deptId));
var states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC',
    'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY',
    'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE',
    'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW',
    'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY', 'AE', 'AA', 'AP'
]


var LocationObject = new mongoose.Schema ({
    type: {
        type: String,
        default: 'Point'
    },
    coordinates: [
        [
            { type: [ Number ]}
        ]
    ]

});

var StationSchema = new mongoose.Schema({
    stationNumber: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique : true,
        index: true
    },
    community: {
        type: mongoose.Schema.Types.String
    },
    //todo - validate platoon exists on the department
    street: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    //todo - validate the assigned hire code exists for the dept.
    city: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    state: {
        type: mongoose.Schema.Types.String,
        uppercase: true,
        required: true,
        enum: states
    },
    zip: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    stationCoordinate: { type: LocationObject,index: '2dsphere'}
}, {timestamps: true});

StationSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        return {
            id: ret._id,
            stationNumber: ret.stationNumber,
            community: ret.community,
            street: ret.street,
            city: ret.city,
            state: ret.state,
            zip: ret.zip
        };
    }
});

var Station = mongoose.model('Station', StationSchema);

module.exports = {
    Station: Station
};
