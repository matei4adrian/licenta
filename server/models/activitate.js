module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "activitate",
    {
      dataInceput: { type: DataTypes.DATE, allowNull: false },
      dataSfarsit: { type: DataTypes.DATE, allowNull: false },
      tipActivitate: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["Seminar", "Curs"],
      },
      rRule: { type: DataTypes.STRING },
    },
    {
      freezeTableName: true,
      tableName: "activitati",
    }
  );
};
