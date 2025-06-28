
module.exports = (sequelize, DataTypes) => {
    const UserCountHistory = sequelize.define('UserCountHistory', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        total_users: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue:1
        }
    }, {
        tableName: 'user_count_history',
        timestamps: true,
        createdAt: 'recorded_at',
        updatedAt: false
    });

    return UserCountHistory;
};