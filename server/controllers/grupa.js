const SerieDB = require("../models").Serie;
const GrupaDB = require("../models").Grupa;
const FacultateDB = require("../models").Facultate;

const controller = {
  getAll: async (req, res) => {
    GrupaDB.findAll({ include: [{ model: SerieDB, include: [FacultateDB] }] })
      .then((grupe) => {
        res.status(200).send(grupe);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
  add: async (req, res) => {
    if (Object.keys(req.body).length === 0) {
      res.status(400).send({ message: "Introduceti datele!" });
    } else if (
      Object.keys(req.body).length + 4 !==
      Object.keys(GrupaDB.rawAttributes).length
    ) {
      res.status(400).json({ message: "Request malformat!" });
    } else if (!req.body.numar) {
      res.status(400).send({ message: "Introduceti numarul grupei!" });
    } else {
      SerieDB.findByPk(req.params.serieId)
        .then(async (serie) => {
          if (serie) {
            const grupaExistenta = await GrupaDB.findOne({
              where: {
                numar: req.body.numar,
              },
            });
            if (!grupaExistenta) {
              serie
                .createGrupa(req.body)
                .then((grupa) => {
                  res.status(201).send(grupa);
                })
                .catch((err) => {
                  console.error(err);
                  res.status(500).send({ message: "Server error!" });
                });
            } else {
              res.status(400).send({ message: "Grupa exista deja!" });
            }
          } else {
            res.status(404).send({ message: "Seria nu exista!" });
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send({ message: "Server error!" });
        });
    }
  },
  update: async (req, res) => {
    if (Object.keys(req.body).length === 0) {
      res.status(400).send({ message: "Introduceti datele!" });
    } else {
      const grupaExistenta = req.body.numar
        ? await GrupaDB.findOne({
            where: {
              numar: req.body.numar,
            },
          })
        : null;
      if (
        !grupaExistenta ||
        grupaExistenta.id === parseInt(req.params.grupaId)
      ) {
        const serieExistenta = req.body.serieId
          ? await SerieDB.findByPk(req.body.serieId)
          : null;
        if (serieExistenta || !req.body.serieId) {
          GrupaDB.findByPk(req.params.grupaId)
            .then(async (grupa) => {
              if (grupa) {
                Object.assign(grupa, req.body);
                await grupa.save();
                res.status(202).send({ message: "Grupa actualizata!" });
              } else {
                res.status(404).json({ message: "Grupa nu exista!" });
              }
            })
            .catch((err) => {
              console.error(err);
              res.status(500).send({ message: "Server error!" });
            });
        } else {
          res.status(400).send({ message: "Seria nu exista!" });
        }
      } else {
        res.status(400).send({ message: "Grupa exista deja!" });
      }
    }
  },
  delete: async (req, res) => {
    GrupaDB.findByPk(req.params.grupaId)
      .then(async (grupa) => {
        if (grupa) {
          await grupa.destroy();
          res.status(202).send({ message: "Grupa a fost stearsa!" });
        } else {
          res.status(404).json({ message: "Grupa nu exista!" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
};

module.exports = controller;
