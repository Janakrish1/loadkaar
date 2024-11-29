const { sequelize } = require('../models');

module.exports = {
    saveTaskDetails: async (req, res) => {
        const {
            task_id,
            deliveryFormData
        } = req.body;

        const { vehicleType, itemDescription, pickupLocation, dropLocation, contactPerson, contactAddress, contactPhoneNumber } = deliveryFormData;

        // Validate required fields
        if (
            !task_id ||
            !vehicleType ||
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
                    vehicleType,
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
                    :vehicleType,
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
                    vehicleType
                },
                type: sequelize.QueryTypes.INSERT,
            });

            // Send a success response with the inserted task details ID
            res.status(201).json({
                message: 'Task details saved successfully.',
            });
        } catch (error) {
            console.error(error); // Log the error for debugging
            res.status(500).json({ error: 'An error occurred while saving the task details.' });
        }
    },
    employerGetTaskDetails: async (req, res) => {
        const { task_id } = req.body;
        if (!task_id) {
            return res.status(400).json({ error: 'Task is not added to DB' });
        }

        try {
            selectQuery = `
                SELECT *
                FROM TaskDetails
                WHERE task_id = :task_id
            `;

            const results = await sequelize.query(selectQuery, {
                replacements: { task_id },
                type: sequelize.QueryTypes.SELECT,
            });

            if (!results || results.length === 0) {
                return res.status(200).json({ 
                    message: 'No tasks found for this employer.', 
                    results: [] 
                });
            }

            res.status(200).json({message: 'Fetched details successfully', results});

        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching the details' });
        }
    },
};
