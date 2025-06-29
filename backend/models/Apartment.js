module.exports = (sequelize, DataTypes) => {
  const Apartment = sequelize.define('Apartment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    window: {
      type: DataTypes.ENUM('insade', 'outside'),
      defaultValue: 'insade'
    },
    parking: {
      type: DataTypes.ENUM('surface', 'underground', 'no'),
      defaultValue: 'no'

    },
    rooms: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false
    },
    booking_status: {
      type: DataTypes.ENUM('available', 'booked', 'sold'),
      defaultValue: 'available'
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    bitrix_id: {
      type: DataTypes.STRING,
      allowNull: true
    }

  }, {
    tableName: 'apartments',
    timestamps: false
  });

  Apartment.associate = (models) => {
    Apartment.belongsTo(models.Developer, { foreignKey: 'developer_id' });
    Apartment.hasMany(models.MediaBlock, { foreignKey: 'apartment_id' });
    Apartment.hasMany(models.Booking, { foreignKey: 'apartment_id' });
    Apartment.hasMany(models.Favorite, { foreignKey: 'apartment_id' });
  };

  return Apartment;
};