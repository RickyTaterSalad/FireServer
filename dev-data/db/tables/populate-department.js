var Department = require("mongoose").model('Department');
var createDepartment = function (callback) {
    console.log("Create dept");
    var dept = new Department(require("../../station-data/department").department);
    var err = dept.validateSync();
    if (err) {
        console.log("generated invalid department");
        console.log(err);
        callback();
    }
    else {
        dept.save(callback);
    }
};
module.exports = {
    createDepartment: createDepartment
};