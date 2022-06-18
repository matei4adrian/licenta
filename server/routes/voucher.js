const express = require("express");
const router = express.Router();
const multerUpload = require("../controllers/other").uploadFile;
const voucherController = require("../controllers").voucher;
const otherController = require("../controllers").other;

router.get("/", voucherController.getAll);
router.post(
  "/",
  [otherController.isLoggedIn, multerUpload.single("fotografie")],
  voucherController.add
);
router.put(
  "/:voucherId",
  [otherController.isLoggedIn, multerUpload.single("fotografie")],
  voucherController.update
);
router.delete(
  "/:voucherId",
  otherController.isLoggedIn,
  voucherController.delete
);

module.exports = router;
