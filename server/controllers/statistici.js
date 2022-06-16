const UserDB = require("../models").User;
const FeedbackDB = require("../models").Feedback;
const ActivitateDB = require("../models").Activitate;
const GrupaDB = require("../models").Grupa;

const controller = {
  getStatistics: async (req, res, next) => {
    try {
      const users = await UserDB.findAll();
      const feedbacks = await FeedbackDB.findAll();
      const activitati = await ActivitateDB.findAll({
        attributes: ["profesorId"],
        include: [{ model: GrupaDB, attributes: ["numar"] }],
      });
      const activitatiGroupByProfesor = activitati.reduce(
        (group, activitate) => {
          const { profesorId } = activitate;
          group[profesorId] = group[profesorId] ?? [];
          group[profesorId].push(activitate);
          return group;
        },
        {}
      );
      let nrProfMax3Grupe = 0;
      let nrProfMax5Grupe = 0;
      let nrProf5GrupePlus = 0;
      Object.keys(activitatiGroupByProfesor).forEach((idProfesor) => {
        const activitateProfesor = activitatiGroupByProfesor[idProfesor];
        const grupeUnice = [];
        for (const activitate of activitateProfesor) {
          for (const grupa of activitate.grupas) {
            if (!grupeUnice.includes(grupa.numar)) {
              grupeUnice.push(grupa.numar);
            }
          }
        }
        if (grupeUnice.length <= 3) {
          nrProfMax3Grupe++;
        } else if (grupeUnice.length > 3 && grupeUnice.length <= 5) {
          nrProfMax5Grupe++;
        } else {
          nrProf5GrupePlus++;
        }
      });

      res.status(200).send({
        usersStats: {
          activeUsers: users.filter((user) => user.username).length,
          newUsers: users.filter((user) => !user.username).length,
        },
        feedbacksStats: {
          resolvedFeedbacks: feedbacks.filter(
            (feedback) => feedback.esteVerificat
          ).length,
          unresolvedFeedbacks: feedbacks.filter(
            (feedback) => !feedback.esteVerificat
          ).length,
        },
        profesorGrupeStats: {
          max3: nrProfMax3Grupe,
          max5: nrProfMax5Grupe,
          above5: nrProf5GrupePlus,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({ message: "Server error!" });
    }
  },
};

module.exports = controller;
