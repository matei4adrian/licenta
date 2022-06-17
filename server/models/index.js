const Sequelize = require("sequelize");
const db = require("../config/db");
const UserModel = require("./user");
const ActivitateModel = require("./activitate");
const FacultateModel = require("./facultate");
const FeedbackModel = require("./feedback");
const GrupaModel = require("./grupa");
const MaterieModel = require("./materie");
const ProfesorModel = require("./profesor");
const SalaModel = require("./sala");
const SerieModel = require("./serie");
const VoucherModel = require("./voucher");

const User = UserModel(db, Sequelize);
const Activitate = ActivitateModel(db, Sequelize);
const Facultate = FacultateModel(db, Sequelize);
const Feedback = FeedbackModel(db, Sequelize);
const Grupa = GrupaModel(db, Sequelize);
const Materie = MaterieModel(db, Sequelize);
const Profesor = ProfesorModel(db, Sequelize);
const Sala = SalaModel(db, Sequelize);
const Serie = SerieModel(db, Sequelize);
const Voucher = VoucherModel(db, Sequelize);

Facultate.hasMany(Activitate, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Activitate.belongsTo(Facultate);

Serie.hasMany(Grupa, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Grupa.belongsTo(Serie);

Sala.hasMany(Activitate);
Activitate.belongsTo(Sala);

Materie.hasMany(Activitate);
Activitate.belongsTo(Materie);

Profesor.hasMany(Activitate);
Activitate.belongsTo(Profesor);

Activitate.belongsToMany(
  Grupa,
  { through: "Activitate_Grupa", foreignKey: "activitateId" },
  {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  }
);
Grupa.belongsToMany(Activitate, {
  through: "Activitate_Grupa",
  foreignKey: "grupaId",
});

Materie.belongsToMany(Profesor, {
  through: "Materie_Profesor",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Profesor.belongsToMany(Materie, {
  through: "Materie_Profesor",
});

module.exports = {
  connection: db,
  User,
  Activitate,
  Facultate,
  Feedback,
  Grupa,
  Materie,
  Profesor,
  Sala,
  Serie,
  Voucher,
};
