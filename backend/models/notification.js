const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
        notification_id: {
            type: DataTypes.UUID, // Matches CHAR(36) for UUID format
            allowNull: false, // Required field
            primaryKey: true, // Set as the primary key
            defaultValue: DataTypes.UUIDV4, // Automatically generates UUID
        },
        user_id: {
            type: DataTypes.INTEGER, // Matches CHAR(36) for UUID format
            allowNull: false, // Required field
            references: {
                model: 'User', // Name of the referenced table
                key: 'user_id', // Referenced column
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        message: {
            type: DataTypes.TEXT, // Matches TEXT for message content
            allowNull: false, // Required field
        },
        is_read: {
            type: DataTypes.BOOLEAN, // Matches BOOLEAN for read status
            defaultValue: false, // Default value
        },
        created_at: {
            type: DataTypes.DATE, // Matches TIMESTAMP for creation time
            defaultValue: DataTypes.NOW, // Default to the current timestamp
        },
    },
    {
        freezeTableName: true, // Prevents Sequelize from pluralizing the table name
        timestamps: false, // Disable createdAt and updatedAt fields since created_at is handled manually
    });

    Notification.associate = (models) => {
        Notification.belongsTo(models.User, {
            foreignKey: 'user_id',
            targetKey: 'user_id',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    };

    return Notification;
};
