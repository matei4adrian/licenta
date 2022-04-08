const express = require("express");
const cors = require("cors");
const passport = require("passport");
const router = require("./routes");
const cookieSession = require("cookie-session");
const fileUpload = require("express-fileupload");
const keys = require("./config/keys");
const config = require("./config/config.json");
const app = express();

app.use(
  cors({
    origin: config.backend_url + "", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  cookieSession({
    name: "orar-session",
    keys: [keys.session.cookieKey],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", config.backend_url + "");
  next();
});

app.use(fileUpload());

app.use("/api", router);

let serverPort = 8080;
app.listen(serverPort, () => {
  console.log("Server is running on port " + serverPort);
});
