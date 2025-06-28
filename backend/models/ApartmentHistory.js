
module.exports = (sequelize, DataTypes) => {
    // История изменений цен
    const ApartmentHistory = sequelize.define('ApartmentHistory', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        old_price: DataTypes.DECIMAL(10, 2),
        new_price: DataTypes.DECIMAL(10, 2),
        change_reason: DataTypes.STRING
    }, {
        tableName: 'apartment_history',
        timestamps: true,
        updatedAt: false
    });

    return ApartmentHistory;
};
