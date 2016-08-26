var normalizedPath = require("path").join(__dirname);
var debug = require('debug')('fireServer:server');
debug("loading requires from: " + normalizedPath);
require("fs").readdirSync(normalizedPath).forEach(function (file) {
    if (file == "index.js") {
        return;
    }
    debug("loading: " + file);
    require("./" + file);
});