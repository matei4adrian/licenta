const SerieDB = require("../models").Serie;
const GrupaDB = require("../models").Grupa;

const controller = {
  getAll: async (req, res) => {
    GrupaDB.findAll()
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
    } else if (!req.body.numar) {
      res.status(400).send({ message: "Introduceti numarul grupei!" });
    } else {
      SerieDB.findByPk(req.params.serieId)
        .then((serie) => {
          if (serie) {
            serie
              .getGrupas({ where: { id: req.params.grupaId } })
              .then(async (grupe) => {
                const grupa = grupe.shift();
                if (grupa) {
                  const grupaExistenta = await GrupaDB.findOne({
                    where: {
                      numar: req.body.numar,
                    },
                  });
                  if (!grupaExistenta) {
                    Object.assign(grupa, req.body);
                    await grupa.save();
                    res.status(202).send({ message: "Grupa actualizata!" });
                  } else {
                    res.status(400).send({ message: "Grupa exista deja!" });
                  }
                } else {
                  res.status(404).send({ message: "Grupa nu exista!" });
                }
              })
              .catch((err) => {
                console.error(err);
                res.status(500).send({ message: "Server error!" });
              });
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
  delete: async (req, res) => {
    SerieDB.findByPk(req.params.serieId)
      .then((serie) => {
        if (serie) {
          serie
            .getGrupas({ where: { id: req.params.grupaId } })
            .then(async (grupe) => {
              const grupa = grupe.shift();
              if (grupa) {
                await grupa.destroy();
                res.status(202).send({ message: "Grupa stearsa!" });
              } else {
                res.status(404).send({ message: "Grupa nu exista!" });
              }
            })
            .catch((err) => {
              console.error(err);
              res.status(500).send({ message: "Server error!" });
            });
        } else {
          res.status(404).send({ message: "Seria nu exista!" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
};

module.exports = controller;