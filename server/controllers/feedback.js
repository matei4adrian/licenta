const FeedbackDB = require("../models").Feedback;

const controller = {
  getAll: async (req, res) => {
    FeedbackDB.findAll()
      .then((feedbacks) => {
        res.status(200).send(feedbacks);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
  add: async (req, res) => {
    const emailRegexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (
      !req.body.email ||
      !req.body.nume ||
      !req.body.subiect ||
      !req.body.comentariu ||
      !req.body.calificativ
    ) {
      res.status(400).send({ message: "Body incomplet!" });
    } else if (
      typeof req.body.email !== "string" ||
      !req.body.email.match(emailRegexp)
    ) {
      res.status(400).send({ message: "Email invalid!" });
    } else if (
      typeof req.body.calificativ !== "string" ||
      !["1", "2", "3", "4", "5"].includes(req.body.calificativ)
    ) {
      res.status(400).send({ message: "Calificativ invalid!" });
    } else {
      FeedbackDB.create(req.body)
        .then((feedback) => {
          res.status(200).send(feedback);
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send(error);
        });
    }
  },
  update: async (req, res) => {
    if (typeof req.body.esteVerificat !== "boolean") {
      res
        .status(400)
        .send({ message: "Verificat trebuie sa fie de tipul boolean!" });
    } else {
      FeedbackDB.findByPk(req.params.feedbackId)
        .then(async (feedback) => {
          if (feedback) {
            Object.assign(feedback, req.body);
            await feedback.save();
            res.status(202).send({ message: "Feedback actualizat!" });
          } else {
            res.status(404).json({ message: "Feedback-ul nu exista!" });
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send({ message: "Server error!" });
        });
    }
  },
  delete: async (req, res) => {
    FeedbackDB.findByPk(req.params.feedbackId)
      .then(async (feedback) => {
        if (feedback) {
          await feedback.destroy();
          res.status(202).send({ message: "Feedback-ul a fost sters!" });
        } else {
          res.status(404).json({ message: "Feedback-ul nu exista!" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
};

module.exports = controller;
