const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers").feedback;
const otherController = require("../controllers").other;

router.get("/", feedbackController.getAll);
router.post("/", feedbackController.add);
router.put("/:feedbackId", feedbackController.update);
router.delete("/:feedbackId", feedbackController.delete);

module.exports = router;
