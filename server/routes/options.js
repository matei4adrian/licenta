const express = require("express");
const router = express.Router();
const optionsController = require("../controllers").options;

router.get("/:facultateId/options", optionsController.getAllOptions);

module.exports = router;
