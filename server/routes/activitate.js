const express = require("express");
const router = express.Router();
const activitateController = require("../controllers").activitate;
const otherController = require("../controllers").other;

router.get("/:facultateId/activitati", activitateController.getAllFiltered);
router.post("/:facultateId/activitati", activitateController.add);
router.put(
  "/:facultateId/activitati/:activitateId",
  activitateController.update
);
router.delete(
  "/:facultateId/activitati/:activitateId",
  activitateController.delete
);

module.exports = router;
