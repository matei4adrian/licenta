const Sequelize = require("sequelize");
const db = require("../config/db");
const UserModel = require("./user");
const AnModel = require("./an");
const CursModel = require("./curs");
const FacultateModel = require("./facultate");
const FeedbackModel = require("./feedback");
const GrupaModel = require("./grupa");
const MaterieModel = require("./materie");
const OrarModel = require("./orar");
const ProfesorModel = require("./profesor");
const SalaModel = require("./sala");
const SerieModel = require("./serie");
const VoucherModel = require("./voucher");

const User = UserModel(db, Sequelize);
const An = AnModel(db, Sequelize);
const Curs = CursModel(db, Sequelize);
const Facultate = FacultateModel(db, Sequelize);
const Feedback = FeedbackModel(db, Sequelize);
const Grupa = GrupaModel(db, Sequelize);
const Materie = MaterieModel(db, Sequelize);
const Orar = OrarModel(db, Sequelize);
const Profesor = ProfesorModel(db, Sequelize);
const Sala = SalaModel(db, Sequelize);
const Serie = SerieModel(db, Sequelize);
const Voucher = VoucherModel(db, Sequelize);

Facultate.hasMany(Orar);
Orar.belongsTo(Facultate);

Orar.hasMany(Feedback);
Feedback.belongsTo(Orar);

Orar.hasOne(Grupa);
Grupa.belongsTo(Orar);

Orar.belongsToMany(Curs, { through: "Orar_Curs" });
Curs.belongsToMany(Orar, { through: "Orar_Curs" });

Serie.hasMany(Grupa);
Grupa.belongsTo(Serie);

Sala.hasMany(Curs);
Curs.belongsTo(Sala);

Materie.hasMany(Curs);
Curs.belongsTo(Materie);

An.hasMany(Materie);
Materie.belongsTo(An);

Materie.belongsToMany(Profesor, { through: "Materie_Profesor" });
Profesor.belongsToMany(Materie, { through: "Materie_Profesor" });

module.exports = {
  connection: db,
  User,
  An,
  Curs,
  Facultate,
  Feedback,
  Grupa,
  Materie,
  Orar,
  Profesor,
  Sala,
  Serie,
  Voucher,
};
