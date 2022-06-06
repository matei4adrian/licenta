const MaterieDB = require("../models").Materie;
const ProfesorDB = require("../models").Profesor;

const controller = {
  getAll: async (req, res) => {
    MaterieDB.findAll({ include: [ProfesorDB] })
      .then((materii) => {
        res.status(200).send(materii);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
  add: async (req, res) => {
    if (req.body.denumire && req.body.semestru && req.body.an) {
      if (req.body.denumire.length < 1) {
        res.status(400).send({ message: "Denumire invalida!" });
      } else if (!["1", "2"].includes(req.body.semestru)) {
        res.status(400).send({
          message: "Semestrul selectat poate fi doar 1 sau 2!",
        });
      } else if (!["1", "2", "3"].includes(req.body.an)) {
        res.status(400).send({
          message: "Anul selectat poate fi doar 1, 2 sau 3 (licenta)!",
        });
      } else {
        const materieExistenta = await MaterieDB.findOne({
          where: {
            denumire: req.body.denumire,
          },
        });
        if (!materieExistenta) {
          MaterieDB.create(req.body)
            .then((materie) => {
              res.status(200).send(materie);
            })
            .catch((error) => {
              console.log(error);
              res.status(500).send(error);
            });
        } else {
          res.status(400).send({ message: "Materia exista deja!" });
        }
      }
    } else {
      res.status(400).send({ message: "Body incomplet!" });
    }
  },
  update: async (req, res) => {
    if (req.body.denumire && req.body.denumire.length < 1) {
      res.status(400).send({ message: "Denumire invalida!" });
    } else if (req.body.semestru && !["1", "2"].includes(req.body.semestru)) {
      res.status(400).send({
        message: "Semestrul selectat poate fi doar 1 sau 2!",
      });
    } else if (req.body.an && !["1", "2", "3"].includes(req.body.an)) {
      res.status(400).send({
        message: "Anul selectat poate fi doar 1, 2 sau 3 (licenta)!",
      });
    } else {
      const materieExistenta = req.body.denumire
        ? await MaterieDB.findOne({
            where: {
              denumire: req.body.denumire,
            },
          })
        : null;
      if (!materieExistenta || materieExistenta.id === req.body.id) {
        MaterieDB.findByPk(req.params.materieId)
          .then(async (materie) => {
            if (materie) {
              Object.assign(materie, req.body);
              await materie.save();
              res.status(202).send({ message: "Materie actualizata!" });
            } else {
              res.status(404).json({ message: "Materia nu exista!" });
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Server error!" });
          });
      } else {
        res.status(400).send({ message: "Materia exista deja!" });
      }
    }
  },
  delete: async (req, res) => {
    MaterieDB.findByPk(req.params.materieId)
      .then(async (materie) => {
        if (materie) {
          await materie.destroy();
          res.status(202).send({ message: "Materia a fost stearsa!" });
        } else {
          res.status(404).json({ message: "Materia nu exista!" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
};

module.exports = controller;
