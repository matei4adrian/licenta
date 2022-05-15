module.exports = (sequelize, DataTypes) => {
  return sequelize.define("feedback", {
    email: { type: DataTypes.STRING, allowNull: false },
    nume: { type: DataTypes.STRING, allowNull: false },
    subiect: { type: DataTypes.STRING, allowNull: false },
    comentariu: { type: DataTypes.STRING, allowNull: false },
    calificativ: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["1", "2", "3", "4", "5"],
    },
    esteVerificat: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
};
