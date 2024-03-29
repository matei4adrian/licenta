const express = require("express");
const router = express.Router();
const grupaController = require("../controllers").grupa;
const otherController = require("../controllers").other;

router.get("/", grupaController.getAll);
router.post("/serii/:serieId", grupaController.add);
router.put("/:grupaId", grupaController.update);
router.delete("/:grupaId", grupaController.delete);

module.exports = router;
