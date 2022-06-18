const SerieDB = require("../models").Serie;
const GrupaDB = require("../models").Grupa;
const FacultateDB = require("../models").Facultate;

const controller = {
  getAll: async (req, res) => {
    SerieDB.findAll({ include: [GrupaDB, FacultateDB] })
      .then((serii) => {
        res.status(200).send(serii);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
  add: async (req, res) => {
    if (req.body.litera && req.body.limba && req.body.facultateId) {
      if (req.body.litera.length !== 1) {
        res.status(400).send({ message: "Introduceti doar litera seriei!" });
      } else if (req.body.limba !== "romana" && req.body.limba !== "engleza") {
        res.status(400).send({
          message: "Seria poate fi doar la limba romana sau engleza!",
        });
      } else {
        const serie = await SerieDB.findOne({
          where: {
            litera: req.body.litera,
            facultateId: req.body.facultateId,
          },
        });
        if (!serie) {
          SerieDB.create(req.body)
            .then((serie) => {
              res.status(200).send(serie);
            })
            .catch((error) => {
              console.log(error);
              res.status(500).send(error);
            });
        } else {
          res
            .status(400)
            .send({ message: "Seria exista deja pentru facultatea aceasta!" });
        }
      }
    } else {
      res.status(400).send({ message: "Body incomplet!" });
    }
  },
  update: async (req, res) => {
    if (req.body.litera && req.body.litera.length !== 1) {
      res.status(400).send({ message: "Introduceti doar litera seriei!" });
    } else if (
      req.body.limba &&
      req.body.limba !== "romana" &&
      req.body.limba !== "engleza"
    ) {
      res.status(400).send({
        message: "Seria poate fi doar la limba romana sau engleza!",
      });
    } else {
      const serie =
        req.body.litera || req.body.facultateId
          ? await SerieDB.findOne({
              where: {
                litera: req.body.litera,
                facultateId: req.body.facultateId,
              },
            })
          : null;
      if (!serie || serie.id === parseInt(req.params.serieId)) {
        SerieDB.findByPk(req.params.serieId)
          .then(async (serie) => {
            if (serie) {
              Object.assign(serie, req.body);
              await serie.save();
              res.status(202).send({ message: "Serie actualizata!" });
            } else {
              res.status(404).json({ message: "Seria nu exista!" });
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Server error!" });
          });
      } else {
        res.status(400).send({ message: "Seria exista deja!" });
      }
    }
  },
  delete: async (req, res) => {
    SerieDB.findByPk(req.params.serieId)
      .then(async (serie) => {
        if (serie) {
          await serie.destroy();
          res.status(202).send({ message: "Seria a fost stearsa!" });
        } else {
          res.status(404).json({ message: "Seria nu exista!" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
};

module.exports = controller;
