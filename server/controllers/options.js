const ActivitateDB = require("../models").Activitate;
const GrupaDB = require("../models").Grupa;
const MaterieDB = require("../models").Materie;
const ProfesorDB = require("../models").Profesor;
const SalaDB = require("../models").Sala;
const FacultateDB = require("../models").Facultate;
const SerieDB = require("../models").Serie;

const controller = {
  getAllOptions: async (req, res, next) => {
    try {
      const facultate = await FacultateDB.findByPk(req.params.facultateId, {
        include: [{ model: SerieDB, include: [GrupaDB] }],
      });
      if (facultate) {
        const activitati = await ActivitateDB.findAll({
          where: {
            facultateId: req.params.facultateId,
          },
          include: [
            { model: GrupaDB, attributes: ["id", "numar"] },
            { model: MaterieDB, attributes: ["id", "denumire"] },
            {
              model: ProfesorDB,
              attributes: ["id", "nume", "prenume", "email"],
            },
            { model: SalaDB, attributes: ["id", "numar"] },
          ],
        });

        const allGrupeOfFacultate = [];
        const grupeSerii = facultate.series.map((serie) => serie.grupas);
        for (const serie of grupeSerii) {
          for (const grupa in serie) {
            allGrupeOfFacultate.push(serie[grupa]);
          }
        }
        const numereGrupe = [];
        const grupe = [];
        const denumiriMaterii = [];
        const materii = [];
        const emailProfesori = [];
        const profesori = [];
        const numereSali = [];
        const sali = [];
        for (const activitate of activitati) {
          const { grupas, materie, profesor, sala } = activitate;
          for (const grupa of grupas) {
            if (!numereGrupe.includes(grupa.numar)) {
              numereGrupe.push(grupa.numar);
              grupe.push({ id: grupa.id, numar: grupa.numar });
            }
          }
          if (!denumiriMaterii.includes(materie.denumire)) {
            denumiriMaterii.push(materie.denumire);
            materii.push(materie);
          }
          if (!emailProfesori.includes(profesor.email)) {
            emailProfesori.push(profesor.email);
            profesori.push(profesor);
          }
          if (!numereSali.includes(sala.numar)) {
            numereSali.push(sala.numar);
            sali.push(sala);
          }
        }

        res.status(200).send({
          allGrupeOfFacultate: allGrupeOfFacultate,
          grupe: grupe,
          materii: materii,
          profesori: profesori,
          sali: sali,
        });
      } else {
        res.status(404).send({ message: "Facultatea nu exista!" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({ message: "Server error!" });
    }
  },
};

module.exports = controller;
