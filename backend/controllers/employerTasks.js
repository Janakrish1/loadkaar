const { sequelize } = require("../models");

module.exports = {
    saveTasks: async (req, res) => {
        const { userID, vehicleType } = req.body;

        console.log(userID, vehicleType);
        if (!userID) {
            return res.status(400).json({ error: 'User is required' });
        }

        try {
            // Insert the task into the database
            const insertQuery = `
                INSERT INTO Tasks (user_id, vehicleType, createdAt, updatedAt)
                VALUES (:userID, :vehicleType, NOW(), NOW());
            `;
            
            // Execute the insert query
            await sequelize.query(insertQuery, {
                replacements: { userID, vehicleType },
                type: sequelize.QueryTypes.INSERT,
            });

            // Fetch the last inserted task_id using LAST_INSERT_ID()
            const [taskIDResult] = await sequelize.query('SELECT LAST_INSERT_ID() AS task_id');

            // Extract the task_id from the result
            const taskID = taskIDResult[0].task_id;

            console.log('Task ID:', taskID);

            // Send a success response with the task ID
            res.status(201).json({
                message: 'Task saved successfully.',
                taskID: taskID,
            });
        } catch (error) {
            console.error(error);  // Log the error for debugging
            res.status(500).json({ error: 'An error occurred while saving the task' });
        }
    },
};
