
var fakePlatoons = ["A", "B", "C"];

var generatePlatoons = function (count, callback) {
    var platoons = [];
    for (var i = 0; i < count; i++) {
        platoons.push(generatePlatoon())
    }
    callback(platoons);

};
var generatePlatoon = function () {
    return fakePlatoons[Math.floor(Math.random() * fakePlatoons.length)];
};
module.exports = {
    generatePlatoons: generatePlatoons,
    generatePlatoon: generatePlatoon
};