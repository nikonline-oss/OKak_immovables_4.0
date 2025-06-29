module.exports = (sequelize, DataTypes) => {
  const MediaBlock = sequelize.define('MediaBlock', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    image: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    url:{
      type: DataTypes.STRING,
      allowNull: true
    },
    type:{
      type: DataTypes.STRING,
      allowNull:true
    },
    position:{
      type: DataTypes.INTEGER,
      allowNull:true
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