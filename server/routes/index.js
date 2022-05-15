const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const authRouter = require("./auth");
const otherRouter = require("./other");
const voucherRouter = require("./voucher");
const serieRouter = require("./serie");
const grupaRouter = require("./grupa");
const facultateRouter = require("./facultate");
const feedbackRouter = require("./feedback");
const salaRouter = require("./sala");

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/vouchers", voucherRouter);
router.use("/serii", serieRouter);
router.use("/grupe", grupaRouter);
router.use("/facultati", facultateRouter);
router.use("/feedbacks", feedbackRouter);
router.use("/sali", salaRouter);
router.use("/", otherRouter);

module.exports = router;
