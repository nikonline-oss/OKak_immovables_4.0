module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define('Purchase', {
    status: {
      type: DataTypes.ENUM('pending', 'reserved', 'completed', 'canceled'),
      defaultValue: 'pending'
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    reserved_until: DataTypes.DATE,
    contract_url: DataTypes.STRING,
    payment_proof_url: DataTypes.STRING,
    completed_at: DataTypes.DATE
  }, {
    tableName: 'purchase',
    timestamps: true,
    underscored: true
  });

  Purchase.associate = models => {
    Purchase.belongsTo(models.Apartment, {
      foreignKey: 'apartment_id',
      as: 'apartment'
    });
    Purchase.belongsTo(models.User, {
      foreignKey: 'buyer_id',
      as: 'buyer'
    });
  };

  return Purchase;
};