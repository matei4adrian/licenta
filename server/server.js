const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const router = require("./routes");
const cookieSession = require("cookie-session");
const fileUpload = require("express-fileupload");
const keys = require("./config/keys");
const config = require("./config/config.json");
const app = express();

global.__basedir = __dirname;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: config.frontend_url, // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through,
  })
);

app.use(
  cookieSession({
    name: "orar-session",
    keys: [keys.session.cookieKey],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "resources/static/assets/uploads"))
);

// app.use(fileUpload());

app.use("/api", router);

let serverPort = 8080;
app.listen(serverPort, () => {
  console.log("Server is running on port " + serverPort);
});
