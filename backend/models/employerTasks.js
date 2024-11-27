const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const Tasks = sequelize.define('Tasks', {
        task_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true, // Automatically generates a unique task_id
            primaryKey: true, // Set as the primary key
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User', // Name of the referenced table (should match the name in the database)
                key: 'user_id', // Primary key in the User table
            },
            onUpdate: 'CASCADE', // Update task user_id if the User's id changes
            onDelete: 'CASCADE', // Delete tasks if the User is deleted
        },
        vehicleType: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['2wheeler', '3wheeler', '4wheeler', 'truck']], // Allow only valid vehicle types
            },
        },
        taskStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['inprogress', 'completed']],
            },
        },
    },
    {
        freezeTableName: true, // Prevents Sequelize from pluralizing the table name
        timestamps: true, // Enable createdAt and updatedAt fields
    });

    Tasks.associate = (models) => {
        Tasks.belongsTo(models.User, {
            foreignKey: 'user_id',
            targetKey: 'user_id',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    };
    return Tasks;
};