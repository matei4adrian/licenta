const express = require("express");
const router = express.Router();

const multerUpload = require("../controllers/other").uploadFile;
const voucherController = require("../controllers").voucher;

router.get("/", voucherController.getAll);
router.post("/", multerUpload.single("fotografie"), voucherController.add);
router.put(
  "/:voucherId",
  multerUpload.single("fotografie"),
  voucherController.update
);
router.delete("/:voucherId", voucherController.delete);

module.exports = router;
