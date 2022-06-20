const express = require("express");
const router = express.Router();
const optionsController = require("../controllers").options;

router.get("/:facultateId/options", optionsController.getFilterOptions);
router.get(
  "/:facultateId/activitateOptions",
  optionsController.getCreateActivitateOptions
);

module.exports = router;
