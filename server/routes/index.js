const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const authRouter = require("./auth");
const otherRouter = require("./other");

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/", otherRouter);

module.exports = router;
