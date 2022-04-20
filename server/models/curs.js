module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "curs",
    {
      denumire: { type: DataTypes.STRING, allowNull: false },
      dataInceput: { type: DataTypes.DATE, allowNull: false },
      dataSfarsit: { type: DataTypes.DATE, allowNull: false },
      tipCurs: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["Seminar", "Curs"],
      },
      rRule: { type: DataTypes.STRING },
    },
    {
      freezeTableName: true,
      tableName: "cursuri",
    }
  );
};
