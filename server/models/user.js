module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "user",
    {
      nume: DataTypes.STRING,
      prenume: DataTypes.STRING,
      email: DataTypes.STRING,
      userName: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  );
};
