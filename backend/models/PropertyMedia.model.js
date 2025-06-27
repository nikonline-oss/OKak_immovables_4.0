module.exports = (sequelize, DataTypes) => {
  const PropertyMedia = sequelize.define('PropertyMedia', {
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    media_type: {
      type: DataTypes.ENUM('image', '3d_tour', 'video', 'plan', 'document'),
      allowNull: false
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    description: DataTypes.STRING(255),
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'property_media',
    timestamps: false,
    underscored: true
  });

  PropertyMedia.associate = models => {
    PropertyMedia.belongsTo(models.Apartment, {
      foreignKey: 'apartment_id',
      as: 'apartment'
    });
    PropertyMedia.belongsTo(models.ResidentialComplex, {
      foreignKey: 'complex_id',
      as: 'complex'
    });
  };

  return PropertyMedia;
};