module.exports = (sequelize, DataTypes) => {
  const DeveloperProfile = sequelize.define('DeveloperProfile', {
    company_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    inn: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    description: DataTypes.TEXT,
    logo_url: DataTypes.STRING,
    contact_email: DataTypes.STRING,
    contact_phone: DataTypes.STRING(20),
    rating: {
      type: DataTypes.SMALLINT,
      defaultValue: 0
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'developer_profile',
    timestamps: true,
    underscored: true
  });

  DeveloperProfile.associate = models => {
    DeveloperProfile.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return DeveloperProfile;
};