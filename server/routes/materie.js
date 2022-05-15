const express = require("express");
const router = express.Router();
const materieController = require("../controllers").materie;
const otherController = require("../controllers").other;

router.get("/", materieController.getAll);
router.post("/", materieController.add);
router.put("/:materieId", materieController.update);
router.delete("/:materieId", materieController.delete);

module.exports = router;
