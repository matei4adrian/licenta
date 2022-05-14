const express = require("express");
const router = express.Router();
const multerUpload = require("../controllers/other").uploadFile;
const facultateController = require("../controllers").facultate;
const otherController = require("../controllers").other;

router.get("/", facultateController.getAll);
router.post("/", multerUpload.single("fotografie"), facultateController.add);
router.put(
  "/:facultateId",
  multerUpload.single("fotografie"),
  facultateController.update
);
router.delete("/:facultateId", facultateController.delete);

module.exports = router;
