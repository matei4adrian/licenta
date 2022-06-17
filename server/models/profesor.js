module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "profesor",
    {
      nume: { type: DataTypes.STRING, allowNull: false },
      prenume: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
      freezeTableName: true,
      tableName: "profesori",
    }
  );
};
