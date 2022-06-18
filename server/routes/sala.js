const express = require("express");
const router = express.Router();
const salaController = require("../controllers").sala;
const otherController = require("../controllers").other;

router.get("/", salaController.getAll);
router.post("/", salaController.add);
router.put("/:salaId", salaController.update);
router.delete("/:salaId", salaController.delete);

module.exports = router;
