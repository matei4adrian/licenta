const express = require("express");
const router = express.Router();
const passport = require("passport");
const auth = require("../controllers/auth");
const otherController = require("../controllers/other");
const config = require("../config/config.json");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: config.frontend_url + "/administrare?fail=true",
  }),
  (req, res) => {
    console.log(req.session);
    res.redirect(config.frontend_url + "/administrare");
  }
);

router.get("/getUser", (req, res) => {
  res.send(req.user);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.cookie("orar-session", {}, { maxAge: -1 });
  res.redirect(`${config.frontend_url}/administrare?logout=true`);
});

module.exports = router;
