module.exports = (sequelize, DataTypes) => {
  const Apartment = sequelize.define('Apartment', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    area: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false
    },
    room_count: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    floor: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    total_floors: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'available', 'reserved', 'sold'),
      defaultValue: 'available'
    },
  }, {
    tableName: 'apartment',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeUpdate: (apartment) => {
        apartment.updated_at = new Date();
      }
    }
  });

  Apartment.associate = models => {
    Apartment.belongsTo(models.ResidentialComplex, {
      foreignKey: 'complex_id',
      as: 'complex'
    });
    Apartment.belongsTo(models.User, {
      foreignKey: 'seller_id',
      as: 'seller'
    });
    Apartment.hasMany(models.PriceHistory, {
      foreignKey: 'apartment_id',
      as: 'price_history'
    });
    Apartment.hasMany(models.Purchase, {
      foreignKey: 'apartment_id',
      as: 'purchases'
    });
    Apartment.hasMany(models.PropertyMedia, {
      foreignKey: 'apartment_id',
      as: 'media'
    });
    Apartment.belongsToMany(models.User, {
      through: models.Favorite,
      foreignKey: 'apartment_id',
      otherKey: 'user_id',
      as: 'favorited_by'
    });
  };

  return Apartment;
};