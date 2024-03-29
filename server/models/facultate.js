module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "facultate",
    {
      denumire: { type: DataTypes.STRING, allowNull: false },
      fotografie: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      tableName: "facultati",
    }
  );
};
