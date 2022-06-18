module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "sala",
    {
      numar: { type: DataTypes.STRING, allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: "sali",
    }
  );
};
