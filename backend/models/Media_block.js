module.exports = (sequelize, DataTypes) => {
  const MediaBlock = sequelize.define('MediaBlock', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    image: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'media_blocks',
    timestamps: false
  });

  MediaBlock.associate = (models) => {
    MediaBlock.belongsTo(models.Apartment, { foreignKey: 'apartment_id' });
  };

  return MediaBlock;
};