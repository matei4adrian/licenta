module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "an",
    {
      valoare: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: "ani",
    }
  );
};
