var validObjectId = function (id) {
    id != null && id.length > 0 ? id.match(/^[0-9a-fA-F]{24}$/) : false;
}


var inalidRequestJson = {success: false, message: "Invalid Request"};

module.exports = {
    validObjectId: validObjectId,
    invalidRequestJson: inalidRequestJson
}