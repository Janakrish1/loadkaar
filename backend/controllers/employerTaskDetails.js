const { sequelize } = require('../models');

module.exports = {
    saveTaskDetails: async (req, res) => {
        const {
            task_id,
            itemDescription,
            pickupLocation,
            dropLocation,
            contactPerson,
            contactAddress,
            contactPhoneNumber,
        } = req.body;

        // Validate required fields
        if (
            !task_id ||
            !itemDescription ||
            !pickupLocation ||
            !dropLocation ||
            !contactPerson ||
            !contactAddress ||
            !contactPhoneNumber
        ) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        try {
            // Insert the task details into the database
            const insertQuery = `
                INSERT INTO TaskDetails (
                    task_id,
                    itemDescription,
                    pickupLocation,
                    dropLocation,
                    contactPerson,
                    contactAddress,
                    contactPhoneNumber,
                    createdAt,
                    updatedAt
                )
                VALUES (
                    :task_id,
                    :itemDescription,
                    :pickupLocation,
                    :dropLocation,
                    :contactPerson,
                    :contactAddress,
                    :contactPhoneNumber,
                    NOW(),
                    NOW()
                );
            `;

            // Execute the insert query
            await sequelize.query(insertQuery, {
                replacements: {
                    task_id,
                    itemDescription,
                    pickupLocation,
                    dropLocation,
                    contactPerson,
                    contactAddress,
                    contactPhoneNumber,
                },
                type: sequelize.QueryTypes.INSERT,
            });

            // Fetch the last inserted taskDetails_id using LAST_INSERT_ID()
            const [result] = await sequelize.query('SELECT LAST_INSERT_ID() AS taskDetails_id');

            // Send a success response with the inserted task details ID
            res.status(201).json({
                message: 'Task details saved successfully.',
                taskDetails_id: result[0].taskDetails_id,
            });
        } catch (error) {
            console.error(error); // Log the error for debugging
            res.status(500).json({ error: 'An error occurred while saving the task details.' });
        }
    },
};
