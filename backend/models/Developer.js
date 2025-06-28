module.exports = (sequelize, DataTypes) => {
  const Developer = sequelize.define('Developer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    inn: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    website: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    }
  }, {
    tableName: 'developers',
    timestamps: false
  });

  Developer.associate = (models) => {
    Developer.belongsTo(models.User, { foreignKey: 'user_id' });
    Developer.hasMany(models.Apartment, { foreignKey: 'developer_id' });
  };

  return Developer;
};