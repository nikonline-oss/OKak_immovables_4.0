module.exports = (sequelize, DataTypes) => {
  const PriceHistory = sequelize.define('PriceHistory', {
    old_price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    new_price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    tableName: 'price_history',
    timestamps: true,
    underscored: true
  });

  PriceHistory.associate = models => {
    PriceHistory.belongsTo(models.Apartment, {
      foreignKey: 'apartment_id',
      as: 'apartment'
    });
  };

  return PriceHistory;
};