const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const otherController = require("../controllers/other");

router.post("/", otherController.isLoggedIn, userController.add);
router.get("/", otherController.isLoggedIn, userController.getAll);
router.post(
  "/importFromCSV",
  otherController.isLoggedIn,
  userController.importFromCSV
);

module.exports = router;
