module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  }, {
    tableName: 'favorites',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  Favorite.associate = (models) => {
    Favorite.belongsTo(models.Apartment, { foreignKey: 'apartment_id' });
    Favorite.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Favorite;
};