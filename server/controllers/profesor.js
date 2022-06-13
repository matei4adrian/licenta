const ProfesorDB = require("../models").Profesor;
const MaterieDB = require("../models").Materie;

const controller = {
  getAll: async (req, res) => {
    ProfesorDB.findAll({ include: [MaterieDB] })
      .then((profesori) => {
        res.status(200).send(profesori);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
  add: async (req, res) => {
    const emailRegexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (Object.keys(req.body).length === 0) {
      res.status(400).send({ message: "Introduceti datele!" });
    } else if (
      Object.keys(req.body).length + 3 !==
      Object.keys(ProfesorDB.rawAttributes).length
    ) {
      res.status(400).json({ message: "Request malformat!" });
    } else if (
      typeof req.body.email !== "string" ||
      !req.body.email.match(emailRegexp)
    ) {
      res.status(400).send({ message: "Email invalid!" });
    } else {
      const profesorExistent = await ProfesorDB.findOne({
        where: {
          nume: req.body.nume,
          prenume: req.body.prenume,
          email: req.body.email,
        },
      });
      if (!profesorExistent) {
        ProfesorDB.create(req.body)
          .then((profesor) => {
            res.status(200).send(profesor);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send(error);
          });
      } else {
        res.status(400).send({ message: "Profesorul exista deja!" });
      }
    }
  },
  addProfesorToMaterie: async (req, res) => {
    const materie = await MaterieDB.findByPk(req.params.materieId);
    if (materie) {
      const profesor = await ProfesorDB.findByPk(req.params.profesorId);
      if (profesor) {
        materie.addProfesor(profesor);
        res.status(200).send(materie);
      } else {
        res.status(400).send({ message: "Profesorul nu exista!" });
      }
    } else {
      res.status(400).send({ message: "Materia nu exista!" });
    }
  },
  update: async (req, res) => {
    if (Object.keys(req.body).length === 0) {
      res.status(400).send({ message: "Introduceti datele!" });
    } else {
      const profesorExistent =
        req.body.nume && req.body.prenume && req.body.email
          ? await ProfesorDB.findOne({
              where: {
                nume: req.body.nume,
                prenume: req.body.prenume,
                email: req.body.email,
              },
            })
          : null;
      if (
        !profesorExistent ||
        profesorExistent.id === parseInt(req.params.profesorId)
      ) {
        ProfesorDB.findByPk(req.params.profesorId)
          .then(async (profesor) => {
            if (profesor) {
              Object.assign(profesor, req.body);
              await profesor.save();
              res.status(202).send({ message: "Profesor actualizat!" });
            } else {
              res.status(404).json({ message: "Profesorul nu exista!" });
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Server error!" });
          });
      } else {
        res.status(400).send({ message: "Profesorul exista deja!" });
      }
    }
  },
  delete: async (req, res) => {
    ProfesorDB.findByPk(req.params.profesorId)
      .then(async (profesor) => {
        if (profesor) {
          await profesor.destroy();
          res.status(202).send({ message: "Profesorul a fost sters!" });
        } else {
          res.status(404).json({ message: "Profesorul nu exista!" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
  removeProfesorFromMaterie: async (req, res) => {
    const materie = await MaterieDB.findByPk(req.params.materieId);
    if (materie) {
      const profesor = await ProfesorDB.findByPk(req.params.profesorId);
      if (profesor) {
        materie.removeProfesor(profesor);
        res.status(200).send(materie);
      } else {
        res.status(400).send({ message: "Profesorul nu exista!" });
      }
    } else {
      res.status(400).send({ message: "Materia nu exista!" });
    }
  },
};

module.exports = controller;

// + adauga materie + sterge materie
