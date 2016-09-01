var router = require('express').Router();
var departmentController = require("../controllers/department-controller");
const RequestHelperMethods = require("../util/request-helper-methods");
const hasUser = require("../validators/has-user-validator").validate;

var cachedDepartment = null;

router.get('/:departmentName', hasUser, function (req, res) {
    console.log("in handler");
    if (req.params && RequestHelperMethods.isDeploymentDepartment(req.params.departmentName)) {
        if (cachedDepartment) {
            res.json(cachedDepartment);
        } else {
            departmentController.findByDepartmentName(req.params.departmentName).then(function (department) {
                console.log(JSON.stringify(department));
                if (department) {
                    cachedDepartment = department;
                    res.json(department);
                } else {
                    res.json({});

                }
            });
        }
    }
    else {
        res.json(RequestHelperMethods.invalidRequestJson);
    }
});
module.exports = router;