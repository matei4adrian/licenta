const Sequelize = require("sequelize");
const db = require("../config/db");
const UserModel = require("./user");
const CursModel = require("./curs");
const FacultateModel = require("./facultate");
const FeedbackModel = require("./feedback");
const GrupaModel = require("./grupa");
const MaterieModel = require("./materie");
const ProfesorModel = require("./profesor");
const SalaModel = require("./sala");
const SerieModel = require("./serie");
const VoucherModel = require("./voucher");

const User = UserModel(db, Sequelize);
const Curs = CursModel(db, Sequelize);
const Facultate = FacultateModel(db, Sequelize);
const Feedback = FeedbackModel(db, Sequelize);
const Grupa = GrupaModel(db, Sequelize);
const Materie = MaterieModel(db, Sequelize);
const Profesor = ProfesorModel(db, Sequelize);
const Sala = SalaModel(db, Sequelize);
const Serie = SerieModel(db, Sequelize);
const Voucher = VoucherModel(db, Sequelize);

Facultate.hasMany(Curs);
Curs.belongsTo(Facultate);

Serie.hasMany(Grupa, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Grupa.belongsTo(Serie);

Sala.hasMany(Curs);
Curs.belongsTo(Sala);

Materie.hasMany(Curs);
Curs.belongsTo(Materie);

Curs.hasOne(Profesor);
Profesor.belongsTo(Curs);

Curs.belongsToMany(Grupa, { through: "Curs_Grupa" });
Grupa.belongsToMany(Curs, { through: "Curs_Grupa" });

Materie.belongsToMany(Profesor, { through: "Materie_Profesor" });
Profesor.belongsToMany(Materie, { through: "Materie_Profesor" });

module.exports = {
  connection: db,
  User,
  Curs,
  Facultate,
  Feedback,
  Grupa,
  Materie,
  Profesor,
  Sala,
  Serie,
  Voucher,
};
