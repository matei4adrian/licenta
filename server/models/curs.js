module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "curs",
    {
      ora: { type: DataTypes.INTEGER, allowNull: false },
      zi: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["1", "2", "3", "4", "5", "6"],
      },
      tipCurs: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["Obligatoriu", "Optional"],
      },
    },
    {
      freezeTableName: true,
      tableName: "cursuri",
    }
  );
};
