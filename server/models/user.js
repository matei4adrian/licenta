module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user", {
    nume: DataTypes.STRING,
    prenume: DataTypes.STRING,
    email: { type: DataTypes.STRING, allowNull: false },
    username: DataTypes.STRING,
  });
};
