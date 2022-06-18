module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "serie",
    {
      litera: { type: DataTypes.CHAR(1), allowNull: false },
      limba: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["romana", "engleza"],
      },
    },
    {
      freezeTableName: true,
      tableName: "serii",
    }
  );
};
