var mongoose = require("mongoose");
var config = require('config');
var util = require('util');

var deptId = config.get('workingDepartment');
var platoons = config.get(util.format('departments.%s.platoons', deptId));
var states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC',
    'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY',
    'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE',
    'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW',
    'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY', 'AE', 'AA', 'AP'
]


var StationSchema = new mongoose.Schema({
    StationNumber: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    Community: {
        type: mongoose.Schema.Types.String
    },
    //todo - validate platoon exists on the department
    Street: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    //todo - validate the assigned hire code exists for the dept.
    City: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    State: {
        type: mongoose.Schema.Types.String,
        uppercase:true,
        required: true,
        enum: states
    },
    Zip: {
        type: mongoose.Schema.Types.Number,
        required: true
    }
}, {timestamps: true});

var Station = mongoose.model('Station', StationSchema);

module.exports = {
    Station: Station
};