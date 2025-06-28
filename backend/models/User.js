module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    bitrix_contact_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  User.associate = (models) => {
    User.hasOne(models.Developer, { foreignKey: 'user_id' });
    User.hasMany(models.Booking, { foreignKey: 'user_id' });
    User.hasMany(models.Favorite, { foreignKey: 'user_id' });
  };

  return User;
};