var normalizedPath = require("path").join(__dirname);
console.log("loading requires from: " + normalizedPath);
require("fs").readdirSync(normalizedPath).forEach(function (file) {
    if (file == "index.js") {
        return;
    }
    console.log("loading: " + file);
    require("./" + file);
});