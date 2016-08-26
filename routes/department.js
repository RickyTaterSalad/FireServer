var router = require('express').Router();
var departmentController = require("../controllers/department-controller");
const RequestHelperMethods = require("../util/request-helper-methods");
const hasUser = require("../validators/has-user-validator").validate;


router.get('/:departmentName', hasUser, function (req, res) {
    if (req.params && RequestHelperMethods.isDeploymentDepartment(req.params.departmentName)) {
        departmentController.findByDepartmentName(req.params.departmentName).then(function (department) {
            if (department) {
                res.json(department);
            } else {
                res.json({});

            }
        });
    }
    else {
        res.json(RequestHelperMethods.invalidRequestJson);
    }
});
module.exports = router;