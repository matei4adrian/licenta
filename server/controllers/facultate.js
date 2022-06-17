const fs = require("fs");
const FacultateDB = require("../models").Facultate;

const controller = {
  getAll: async (req, res, next) => {
    FacultateDB.findAll()
      .then((facultati) => {
        res.status(200).send(facultati);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
  add: async (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Body invalid!" });
    } else if (!req.body.denumire) {
      res.status(400).send({ message: "Facultate invalida!" });
    } else if (req.body.denumire.length < 3) {
      res.status(400).send({ message: "Facultate invalida!" });
    } else if (req.file === undefined) {
      return res.send(`Trebuie sa selectezi o fotografie!`);
    } else {
      const facultateExistenta = await FacultateDB.findOne({
        where: { denumire: req.body.denumire },
      });
      if (!facultateExistenta) {
        FacultateDB.create({
          denumire: req.body.denumire,
          fotografie: req.file.filename,
        })
          .then((facultate) => {
            return res.send(facultate);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send({ message: "Server error" });
          });
      } else {
        res.status(400).send({ message: "Facultatea exista deja!" });
      }
    }
  },
  update: async (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Body invalid!" });
    } else if (!req.body.denumire) {
      res.status(400).send({ message: "Facultate invalida!" });
    } else if (req.body.denumire.length < 3) {
      res.status(400).send({ message: "Facultate invalida!" });
    } else if (req.file === undefined) {
      return res.send(`Trebuie sa selectezi o fotografie!`);
    } else {
      const facultateExistenta = await FacultateDB.findOne({
        where: { denumire: req.body.denumire },
      });
      if (
        !facultateExistenta ||
        facultateExistenta.id === parseInt(req.params.facultateId)
      ) {
        FacultateDB.findByPk(req.params.facultateId)
          .then(async (facultate) => {
            if (facultate) {
              const initialPath = facultate.fotografie;
              const initialEntitiesWithThisPhoto = await FacultateDB.findAll({
                where: {
                  fotografie: initialPath,
                },
              });
              const updated = {
                denumire: req.body.denumire,
              };
              if (req.file) {
                updated["fotografie"] = req.file.filename;
              }
              Object.assign(facultate, updated);
              await facultate.save();
              if (
                req.file &&
                req.file.filename !== initialPath &&
                initialEntitiesWithThisPhoto.length === 1
              ) {
                fs.unlinkSync(
                  `${__basedir}/resources/static/assets/uploads/${initialPath}`
                );
              }
              res.status(202).send({ message: "Facultate actualizata!" });
            } else {
              res.status(404).json({ message: "Facultatea nu exista!" });
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Server error!" });
          });
      } else {
        res.status(400).send({ message: "Facultatea exista deja!" });
      }
    }
  },
  delete: async (req, res) => {
    FacultateDB.findByPk(req.params.facultateId)
      .then(async (facultate) => {
        if (facultate) {
          const initialPath = facultate.fotografie;
          const initialEntitiesWithThisPhoto = await FacultateDB.findAll({
            where: {
              fotografie: initialPath,
            },
          });
          await facultate.destroy();
          if (initialEntitiesWithThisPhoto.length === 1) {
            fs.unlinkSync(
              `${__basedir}/resources/static/assets/uploads/${initialPath}`
            );
          }
          res.status(202).send({ message: "Facultate stearsa!" });
        } else {
          res.status(404).json({ message: "Facultatea nu exista!" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
};

module.exports = controller;
