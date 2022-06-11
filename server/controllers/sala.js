const SalaDB = require("../models").Sala;

const controller = {
  getAll: async (req, res) => {
    SalaDB.findAll()
      .then((sali) => {
        res.status(200).send(sali);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
  add: async (req, res) => {
    if (req.body.numar) {
      const salaExistenta = await SalaDB.findOne({
        where: {
          numar: req.body.numar,
        },
      });
      if (!salaExistenta) {
        SalaDB.create(req.body)
          .then((sala) => {
            res.status(200).send(sala);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send(error);
          });
      } else {
        res.status(400).send({ message: "Sala exista deja!" });
      }
    } else {
      res.status(400).send({ message: "Nu ai introdus un numar!" });
    }
  },
  update: async (req, res) => {
    if (!req.body.numar) {
      res.status(400).send({ message: "Nu ai introdus un numar!" });
    } else {
      const salaExistenta = await SalaDB.findOne({
        where: {
          numar: req.body.numar,
        },
      });
      if (!salaExistenta || salaExistenta.id === req.body.id) {
        SalaDB.findByPk(req.params.salaId)
          .then(async (sala) => {
            if (sala) {
              Object.assign(sala, req.body);
              await sala.save();
              res.status(202).send({ message: "Sala actualizata!" });
            } else {
              res.status(404).json({ message: "Sala nu exista!" });
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Server error!" });
          });
      } else {
        res.status(400).send({ message: "Sala exista deja!" });
      }
    }
  },
  delete: async (req, res) => {
    SalaDB.findByPk(req.params.salaId)
      .then(async (sala) => {
        if (sala) {
          await sala.destroy();
          res.status(202).send({ message: "Sala a fost stearsa!" });
        } else {
          res.status(404).json({ message: "Sala nu exista!" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
};

module.exports = controller;
