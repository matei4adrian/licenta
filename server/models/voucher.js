module.exports = (sequelize, DataTypes) => {
  return sequelize.define("voucher", {
    compania: { type: DataTypes.STRING, allowNull: false },
    fotografie: DataTypes.BLOB("long"),
    valoare: { type: DataTypes.STRING, allowNull: false },
    descriere: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
