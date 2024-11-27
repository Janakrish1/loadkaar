const { sequelize } = require('../models');

module.exports = {
    saveTaskDetails: async (req, res) => {
        const {
            task_id,
            itemDescription,
            pickupLocation,
            dropLocation,
            contactDetails
        } = req.body;

        if (!task_id || !itemDescription || !pickupLocation || !dropLocation || !contactDetails) {
            return res.status(400).json({ error: 'Task Details are required' });
        }

        try {
            // Insert the task into the database
            const insertQuery = `
                    INSERT INTO TaskDetails (task_id, itemDescription, pickupLocation, dropLocation, contactDetails, createdAt, updatedAt)
                    VALUES (:task_id, :itemDescription, :pickupLocation, :dropLocation, :contactDetails, NOW(), NOW());
                `;

            // Execute the insert query
            await sequelize.query(insertQuery, {
                replacements: { task_id, itemDescription, pickupLocation, dropLocation, contactDetails },
                type: sequelize.QueryTypes.INSERT,
            });

            // Fetch the last inserted task_id using LAST_INSERT_ID()
            const [result] = await sequelize.query('SELECT LAST_INSERT_ID() AS task_id');

            // Send a success response with the task ID
            res.status(201).json({
                message: 'Task details saved successfully.'
            });
        } catch (error) {
            console.error(error);  // Log the error for debugging
            res.status(500).json({ error: 'An error occurred while saving the task details' });
        }
    },
};
