module.exports = (sequelize, DataTypes) => {
  return sequelize.define("feedback", {
    email: { type: DataTypes.STRING, allowNull: true },
    nume: { type: DataTypes.STRING, allowNull: true },
    subiect: { type: DataTypes.STRING, allowNull: false },
    comentariu: { type: DataTypes.STRING, allowNull: false },
    calificativ: {
      type: DataTypes.ENUM,
      allowNull: true,
      values: ["1", "2", "3", "4", "5"],
    },
    esteVerificat: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
};
