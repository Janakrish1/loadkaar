module.exports = (sequelize, DataTypes) => {
    const TaskDetails = sequelize.define('TaskDetails', {
        taskDetails_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true, // Automatically generates a unique task_id
            primaryKey: true, // Set as the primary key
        },
        task_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Tasks', // Name of the referenced table (should match the name in the database)
                key: 'task_id', // Primary key in the User table
            },
            onUpdate: 'CASCADE', // Update task user_id if the User's id changes
            onDelete: 'CASCADE', // Delete tasks if the User is deleted
        },
        itemDescription: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 500], // Description must be between 1 and 500 characters
            },
        },
        pickupLocation: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dropLocation: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contactDetails: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isNumeric: true, // Ensure the contact details contain only numbers (e.g., phone number)
                len: [10, 15], // Allow phone numbers between 10 and 15 characters
            },
        },
    },
    {
        freezeTableName: true, // Prevents Sequelize from pluralizing the table name
        timestamps: true, // Enable createdAt and updatedAt fields
    });

    TaskDetails.associate = (models) => {
        TaskDetails.belongsTo(models.Tasks, {
            foreignKey: 'task_id',
            targetKey: 'task_id',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    };

    return TaskDetails;
};
