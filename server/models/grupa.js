module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "grupa",
    {
      numar: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: "grupe",
    }
  );
};
