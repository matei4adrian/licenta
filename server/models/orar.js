module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "orar",
    {
      denumire: { type: DataTypes.STRING, allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: "orare",
    }
  );
};
