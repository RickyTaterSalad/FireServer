var router = require('express').Router();
var departmentController = require("../controllers/department-controller");
const hasUser = require("../validators/has-user-validator").validate;
var config = require('config');
var cachedDepartment = null;
var deploymentDepartment = config.get("workingDepartment");


router.get('/:departmentName', function (req, res) {
    if (req.params && req.params.departmentName == deploymentDepartment) {
        if (cachedDepartment) {
            res.json(cachedDepartment);
        } else {
            departmentController.findByDepartmentName(req.params.departmentName).then(function (department) {
                if (department) {
                    cachedDepartment = department;
                    res.json(department);
                } else {
                    return res.status(400).send();

                }
            });
        }
    }
    else {
        return res.status(400).send();
    }
});
module.exports = router;