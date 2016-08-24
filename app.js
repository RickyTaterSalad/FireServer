var config = require('config');

//init all the helper functions

//init mongoose
var mongooseHelper = require("./helpers/mongoose-helper");
mongooseHelper.initialize();

//init passport
require("./helpers/passport-helper").initialize()

//init and create the express object
var app = require("./helpers/express-init-helper").initialize();

//express auth helper
require("./helpers/express-auth-helper").initialize(app);
require("./helpers/express-route-helper").initialize(app);



module.exports = app;
