const express = require("express");
const router = express.Router();
const passport = require("passport");
const auth = require("../controllers/auth");
const otherController = require("../controllers/other");
const config = require("../config/config.json");

router.get("/fail", (req, res) =>
  res.status(400).send({ message: "Logarea a esuat!" })
);
router.get("/success", otherController.isLoggedIn, (req, res) => {
  res.status(200).send({ message: `Buna, ${req.user.username}` });
});
router.get("/logout-success", (req, res) => {
  res.status(200).send({ message: "Te-ai delogat cu succes!" });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: config.backend_url + "api/auth/fail",
  }),
  (req, res) => {
    console.log(req.session);
    res.redirect(config.backend_url + "api/auth/success");
  }
);

router.get("/getUser", (req, res) => {
  res.send(req.user);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.cookie("orar-session", {}, { maxAge: -1 });
  res.redirect(`${config.backend_url}api/auth/logout-success`);
});

module.exports = router;
