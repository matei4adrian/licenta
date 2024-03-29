const UserDB = require("../models").User;

const controller = {
  add: async (req, res) => {
    const user = {
      email: req.body.email,
    };
    let err = false;
    if (!user.email) {
      res.status(400).send({
        message: "Emailul trebuie sa fie completat!",
      });
      err = true;
    }
    if (
      !user.email.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      res.status(400).send({
        message: "Email invalid!",
      });
      err = true;
    }
    await UserDB.findOne({
      where: {
        email: user.email,
      },
    })
      .then((findUser) => {
        if (findUser) {
          err = true;
          throw new Error("User deja existent!");
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(400).send({
          message: "Email deja inserat in baza de date!",
        });
      });

    if (!err) {
      await UserDB.create(user)
        .then((newUser) => {
          res.status(201).send(newUser);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send({ message: "Eroare la inserarea userului!" });
        });
    }
  },

  getAll: async (req, res) => {
    await UserDB.findAll()
      .then((users) => res.status(200).send(users))
      .catch(() =>
        res
          .status(500)
          .send({ message: "Eroare la obtinerea tuturor userilor!" })
      );
  },

  importFromCSV: async (req, res) => {
    try {
      const duplicateUsers = [];
      const malUsers = [];
      const users = await UserDB.findAll();
      const userEmails = users.map((user) => user.email);
      for (const user of req.body.users) {
        if (userEmails.includes(user[0])) {
          duplicateUsers.push(user[0]);
        }
        if (
          !user[0].match(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
        ) {
          malUsers.push(user[0]);
        }
      }
      if (malUsers.length > 0) {
        res.status(400).send({
          message: `Urmatoarele emailuri nu au formatul corect: ${malUsers.join(
            ", "
          )}`,
        });
      } else if (duplicateUsers.length > 0) {
        res.status(400).send({
          message: `Userii urmatori exista deja in baza de date: ${duplicateUsers.join(
            ", "
          )}`,
        });
      } else {
        req.body.users.forEach((user) => {
          UserDB.create({
            email: user[0],
          });
        });
        res.status(201).send({ message: "Useri inserati cu succes!" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  },
};

module.exports = controller;
