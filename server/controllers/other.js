const connection = require("../models").connection;
const path = require("path");
const config = require("../config/config.json");
const mysql = require("mysql2/promise");
const multer = require("multer");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    const originalname = file.originalname.substring(
      0,
      file.originalname.length - path.extname(file.originalname).length
    );
    cb(null, `${originalname}.jpg`);
  },
});

const controller = {
  reset: async (req, res, next) => {
    const { database, host, port, user, password } = config.database;
    const connect = await mysql
      .createConnection({
        host,
        port,
        user,
        password,
      })
      .catch((err) => {
        console.error(err);
      });
    await connect.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    connection
      .sync({ force: true })
      .then(() => {
        res.status(201).send({ message: "Baza de date resetata!" });
        next();
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Resetarea bazei de date a esuat!", error: err });
      });
  },
  isLoggedIn: (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.status(401).send("Nu esti autentificat!");
    }
  },

  uploadFile: multer({ storage: storage, fileFilter: imageFilter }),
};

module.exports = controller;
