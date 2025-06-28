module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'canceled'),
      defaultValue: 'pending'
    },
    bitrix_deal_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'bookings',
    timestamps: false
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.Apartment, { foreignKey: 'apartment_id' });
    Booking.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Booking;
};