const connection = require("../models").connection;
const config = require("../config/config.json");
const mysql = require("mysql2/promise");

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
};

module.exports = controller;
