var validObjectId = function (id) {
    id != null && id.length > 0 ? id.match(/^[0-9a-fA-F]{24}$/) : false;
}


var invalidRequestJson = {success: false, message: "Invalid Request"};
var noUserJson = {success: false, message: "Not Logged In"};
module.exports = {
    validObjectId: validObjectId,
    invalidRequestJson: invalidRequestJson,
    noUserJson: noUserJson
}