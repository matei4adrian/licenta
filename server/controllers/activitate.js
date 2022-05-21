// id: 0,
// title: "Algebra", din legatura cu materie o materie la mai multe cursuri si un curs la o materie
// startDate: new Date(2022, 3, 18, 9, 15), alese din ui
// endDate: new Date(2022, 3, 18, 10, 45),  alese din ui
// type: "Seminar", din tipul cursului
// sala: "1022", din legatura cu sala un curs va avea o sala
// profesor: "Costel", 1 profesor la un curs
// grupa: "1023, 1024", curs o sa aiba mai multe grupe mapate din serie ( de aici se poate obtine si seria)
// rRule: "FREQ=WEEKLY;BYDAY=MO", // construit pe front in functie de ziua aleasa, interval = 2 daca e seminar o data la 2 sapt

// curs il adaug la o facultate
//curs o sa fie si la mai multe grupe
//profesor ul ales
//materie care va da si titlul

const ActivitateDB = require("../models").Activitate;
const GrupaDB = require("../models").Grupa;
const MaterieDB = require("../models").Materie;
const SalaDB = require("../models").Sala;
const ProfesorDB = require("../models").Profesor;
const FacultateDB = require("../models").Facultate;

const getExistentaGrupe = async (grupe) => {
  for (let i = 0; i < grupe.length; i++) {
    const grupa = await GrupaDB.findOne({
      where: { numar: grupe[i] },
    });
    if (!grupa) {
      return false;
    }
  }
  return true;
};

const controller = {
  getAllFiltered: async (req, res) => {
    const { materie, grupa, profesor, sala } = req.query;
    const where = {};
    where.facultateId = req.params.facultateId;

    if (materie) {
      where["$materie.denumire$"] = materie;
    }
    if (grupa) {
      where["$grupas.numar$"] = grupa;
    }
    if (profesor) {
      where["$profesor.email$"] = profesor;
    }
    if (sala) {
      where["$sala.numar$"] = sala;
    }
    ActivitateDB.findAll({
      where,
      include: [MaterieDB, GrupaDB, ProfesorDB, SalaDB],
    })
      .then((activitati) => {
        res.status(200).send(activitati);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
  add: async (req, res) => {
    const {
      stringDataInceput,
      stringDataSfarsit,
      tipActivitate,
      rRule,
      salaId,
      materieId,
      profesorId,
      grupe,
    } = req.body;
    const dataInceput = new Date(stringDataInceput);
    const dataSfarsit = new Date(stringDataSfarsit);
    if (Object.keys(req.body).length === 0) {
      res.status(400).send({ message: "Empty body!" });
    } else if (
      !tipActivitate ||
      (tipActivitate !== "Seminar" && tipActivitate !== "Curs")
    ) {
      res.status(400).send({ message: "Tip activitate invalid!" });
    } else if (!dataInceput || !dataSfarsit || dataInceput > dataSfarsit) {
      res.status(400).send({ message: "Date invalide!" });
    } else if (!salaId || !materieId || !profesorId) {
      res
        .status(400)
        .send({ message: "Introduceti sala, materia si profesorul!" });
    } else if (!grupe || grupe.length > 5) {
      console.log(typeof grupe, grupe.length, grupe[0]);
      res.status(400).send({ message: "Introduceti grupa/grupele (maxim 5)!" });
    } else {
      const sala = await SalaDB.findByPk(salaId);
      const materie = await MaterieDB.findByPk(materieId);
      const profesor = await ProfesorDB.findByPk(profesorId);
      const isGrupe = await getExistentaGrupe(grupe);
      console.log(isGrupe);
      if (sala && materie && profesor && isGrupe) {
        FacultateDB.findByPk(req.params.facultateId)
          .then((facultate) => {
            if (facultate) {
              facultate
                .createActivitate({
                  dataInceput,
                  dataSfarsit,
                  tipActivitate,
                  rRule,
                })
                .then(async (activitate) => {
                  sala.addActivitate(activitate);
                  materie.addActivitate(activitate);
                  profesor.addActivitate(activitate);
                  for (let i = 0; i < grupe.length; i++) {
                    const grupa = await GrupaDB.findOne({
                      where: { numar: grupe[i] },
                    });
                    activitate.addGrupa(grupa);
                  }
                  res.status(201).send(activitate);
                })
                .catch((err) => {
                  console.error(err);
                  res.status(500).send({ message: "Server error!" });
                });
            } else {
              res.status(404).send({ message: "Facultatea nu a fost gasita!" });
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Server error!" });
          });
      } else {
        res
          .status(400)
          .send({ message: "Introduceti toate detaliile cu date existente!" });
      }
    }
  },
  update: async (req, res) => {
    const { grupe, stringDataInceput, stringDataSfarsit } = req.body;
    const dataInceput = new Date(stringDataInceput);
    const dataSfarsit = new Date(stringDataSfarsit);
    if (Object.keys(req.body).length === 0) {
      res.status(400).send({ message: "Empty body!" });
    } else if (!dataInceput || !dataSfarsit || dataInceput > dataSfarsit) {
      res.status(400).send({ message: "Date invalide!" });
    } else {
      const isGrupe = await getExistentaGrupe(grupe);
      if (isGrupe) {
        ActivitateDB.findByPk(req.params.activitateId)
          .then(async (activitate) => {
            if (activitate) {
              Object.assign(activitate, {
                ...req.body,
                dataInceput,
                dataSfarsit,
              });
              if (req.body.grupe) {
                activitate.setGrupas([]);
                for (let i = 0; i < grupe.length; i++) {
                  const grupa = await GrupaDB.findOne({
                    where: { numar: grupe[i] },
                  });
                  activitate.addGrupa(grupa);
                }
              }
              await activitate.save();
              res.status(202).send({ message: "Activitate actualizata!" });
            } else {
              res.status(404).send({ message: "Activitatea nu exista!" });
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Server error!" });
          });
      } else {
        res.status(400).send({ message: "Grupe invalide!" });
      }
    }
  },
  delete: async (req, res) => {
    ActivitateDB.findByPk(req.params.activitateId)
      .then(async (activitate) => {
        if (activitate) {
          await activitate.destroy();
          res.status(202).send({ message: "Activitate stearsa!" });
        } else {
          res.status(404).send({ message: "Activitatea nu exista!" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
};

module.exports = controller;
