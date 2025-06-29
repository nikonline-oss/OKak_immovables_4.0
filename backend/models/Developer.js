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
    address:{
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone:{
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email:{
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    views:{
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    website: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    bitrix_company_id: {
      type: DataTypes.INTEGER,
      allowNull: true
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