module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Message content cannot be empty'
        }
      }
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    attachments: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  }, {
    tableName: 'messages',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['chat_id']
      },
      {
        fields: ['sender_id']
      }
    ]
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: 'sender_id',
      as: 'sender'
    });
    Message.belongsTo(models.Chat, {
      foreignKey: 'chat_id',
      as: 'chat'
    });
  };

  return Message;
};