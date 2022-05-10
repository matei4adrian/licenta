const fs = require("fs");
const VoucherDB = require("../models").Voucher;

const controller = {
  getAll: async (req, res, next) => {
    VoucherDB.findAll()
      .then((vouchers) => {
        res.status(200).send(vouchers);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
  add: async (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Body invalid!" });
    } else if (!req.body.descriere) {
      res.status(400).send({ message: "Voucher invalid!" });
    } else if (req.body.descriere.length < 10) {
      res.status(400).send({ message: "Voucher invalid!" });
    } else if (req.file === undefined) {
      return res.send(`Trebuie sa selectezi o fotografie!`);
    } else {
      VoucherDB.create({
        compania: req.body.compania,
        fotografie: req.file.filename,
        valoare: req.body.valoare,
        descriere: req.body.descriere,
      })
        .then((voucher) => {
          return res.send(voucher);
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send({ message: "Server error" });
        });
    }
  },

  update: async (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Body invalid!" });
    } else if (!req.body.descriere) {
      res.status(400).send({ message: "Voucher invalid!" });
    } else if (req.body.descriere.length < 10) {
      res.status(400).send({ message: "Voucher invalid!" });
    } else if (req.file === undefined) {
      return res.send(`Trebuie sa selectezi o fotografie!`);
    } else {
      VoucherDB.findByPk(req.params.voucherId)
        .then(async (voucher) => {
          if (voucher) {
            const initialPath = voucher.fotografie;
            Object.assign(voucher, {
              compania: req.body.compania,
              fotografie: req.file.filename,
              valoare: req.body.valoare,
              descriere: req.body.descriere,
            });
            await voucher.save();
            fs.unlinkSync(
              `${__basedir}/resources/static/assets/uploads/${initialPath}`
            );
            res.status(202).send({ message: "Voucher actualizat!" });
          } else {
            res.status(404).json({ message: "Voucher-ul nu exista!" });
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send({ message: "Server error!" });
        });
    }
  },
  delete: async (req, res) => {
    VoucherDB.findByPk(req.params.voucherId)
      .then(async (voucher) => {
        if (voucher) {
          const initialPath = voucher.fotografie;
          await voucher.destroy();
          fs.unlinkSync(
            `${__basedir}/resources/static/assets/uploads/${initialPath}`
          );
          res.status(202).send({ message: "Voucher sters!" });
        } else {
          res.status(404).json({ message: "Voucher-ul nu exista!" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Server error!" });
      });
  },
};

module.exports = controller;
