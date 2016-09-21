var router = require('express').Router();
var departmentController = require("../controllers/department-controller");
const RequestHelperMethods = require("../util/request-helper-methods");
const hasUser = require("../validators/has-user-validator").validate;

var cachedDepartment = null;

router.get('/:departmentName', hasUser, function (req, res) {
    if (req.params && RequestHelperMethods.isDeploymentDepartment(req.params.departmentName)) {
        if (cachedDepartment) {
            res.json(cachedDepartment);
        } else {
            departmentController.findByDepartmentName(req.params.departmentName).then(function (department) {
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
        return res.status(400).send();
    }
});
module.exports = router;