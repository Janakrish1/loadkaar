module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true, // Ensure it's a valid email format
            },
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        houseNo: {
            type: DataTypes.STRING,
            allowNull: true, // Optional field
        },
        locality: {
            type: DataTypes.STRING,
            allowNull: true, // Optional field
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true, // Optional field
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true, // Optional field
        },
        pincode: {
            type: DataTypes.STRING,
            allowNull: true, // Optional field
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isNumeric: true, // Ensure the phone number contains only numbers
                len: [10, 15], // Allow phone numbers between 10 and 15 characters
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        freezeTableName: true, // Prevents Sequelize from pluralizing the table name
        timestamps: true, // Enable createdAt and updatedAt fields
    });

    // Define composite primary key on `email` and `role`
    User.removeAttribute('id'); // Remove the default `id` field
    User.primaryKeyAttributes = ['email', 'role'];

    return User;
};
