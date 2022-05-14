const express = require("express");
const router = express.Router();
const serieController = require("../controllers").serie;
const otherController = require("../controllers").other;

router.get("/", serieController.getAll);
router.post("/", serieController.add);
router.put("/:serieId", serieController.update);
router.delete("/:serieId", serieController.delete);

module.exports = router;
