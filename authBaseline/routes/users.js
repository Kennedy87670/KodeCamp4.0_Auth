var express = require("express");
const rolesAllowed = require("../middleware/roleBasedAuth");

var router = express.Router();

router.use(rolesAllowed("user"));

/* GET users listing. */
router.get("/", function (req, res, next) {});

module.exports = router;
