const express = require("express");
const router = express.Router();
const statisticiController = require("../controllers").statistici;

router.get("/", statisticiController.getStatistics);

module.exports = router;
