module.exports = (sequelize, DataTypes) => {
  const ResidentialComplex = sequelize.define('ResidentialComplex', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false
    },
    completion_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'available', 'reserved', 'sold'),
      defaultValue: 'available'
    },
  }, {
    tableName: 'residential_complex',
    timestamps: true,
    underscored: true
  });

  ResidentialComplex.associate = models => {
    ResidentialComplex.belongsTo(models.User, {
      foreignKey: 'developer_id',
      as: 'developer'
    });
    ResidentialComplex.hasMany(models.Apartment, {
      foreignKey: 'complex_id',
      as: 'apartments'
    });
    ResidentialComplex.hasMany(models.PropertyMedia, {
      foreignKey: 'complex_id',
      as: 'media'
    });
  };

  return ResidentialComplex;
};