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
const materieRouter = require("./materie");
const profesorRouter = require("./profesor");
const activitateRouter = require("./activitate");

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/vouchers", voucherRouter);
router.use("/serii", serieRouter);
router.use("/grupe", grupaRouter);
router.use("/facultati", facultateRouter);
router.use("/feedbacks", feedbackRouter);
router.use("/sali", salaRouter);
router.use("/materii", materieRouter);
router.use("/profesori", profesorRouter);
router.use("/facultati", activitateRouter);
router.use("/", otherRouter);

module.exports = router;
