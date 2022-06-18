module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "materie",
    {
      denumire: { type: DataTypes.STRING, allowNull: false },
      semestru: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["1", "2"],
      },
      an: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["1", "2", "3"],
      },
    },
    {
      freezeTableName: true,
      tableName: "materii",
    }
  );
};
