module.exports = (sequelize, DataTypes) => {
    const Favorite = sequelize.define('Favorite', {
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'favorite',
        timestamps: false,
        underscored: true
    });

    Favorite.associate = models => {
        Favorite.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        Favorite.belongsTo(models.Apartment, {
            foreignKey: 'apartment_id',
            as: 'apartment'
        });
    };

    return Favorite;
};