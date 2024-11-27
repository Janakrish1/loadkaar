const { sequelize } = require("../models");

module.exports = {
    saveTasks: async (req, res) => {
        const {
            userID,
            vehicleType
        } = req.body;

        console.log(userID, vehicleType);
        if (!userID) {
            return res.status(400).json({ error: 'User is required' });
        }
 
        try {
            // console.log(userID, formData.vehicleType); 

            insertQuery = `
            INSERT INTO Tasks (
                user_id, vehicleType, createdAt, updatedAt
            )
            VALUES (
                :userID, :vehicleType, NOW(), NOW()
            )
        `;

            await sequelize.query(insertQuery, {
                replacements: { userID, vehicleType },
                type: sequelize.QueryTypes.INSERT,
            });

            // Send a success response after inserting the user
            res.status(201).json({ message: 'User registered successfully. Please login.' });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while registering the user' });
        }
    },
}