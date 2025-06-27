module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { is: /^\+?[0-9]{10,15}$/ }
    },
    avatar_url: DataTypes.STRING,
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true
  });

  User.associate = models => {
    User.hasOne(models.DeveloperProfile, { foreignKey: 'user_id' });
    User.hasMany(models.ResidentialComplex, { foreignKey: 'developer_id' });
    User.hasMany(models.Apartment, { foreignKey: 'seller_id' });
    User.hasMany(models.Purchase, { foreignKey: 'buyer_id' });
    User.belongsToMany(models.Apartment, { 
      through: models.Favorite,
      foreignKey: 'user_id',
      otherKey: 'apartment_id'
    });
  };

  return User;
};