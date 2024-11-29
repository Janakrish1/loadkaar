const { sequelize } = require("../models");

module.exports = {
    saveTasks: async (req, res) => {
        const { paymentResponse, paymentData: paymentData } = req.body;
        const { razorpay_payment_id: payment_id } = paymentResponse;
        const { user_id: employer_id, employee_id } = paymentData;

        if (!payment_id) {
            return res.status(400).json({ error: 'Payment transaction is cancelled abruptly' });
        }

        try {
            // Insert the task into the database
            const insertQuery = `
                INSERT INTO Tasks (payment_id, employer_id, employee_id, createdAt, updatedAt)
                VALUES (:payment_id, :employer_id, :employee_id, NOW(), NOW());
            `;
            
            // Execute the insert query
            await sequelize.query(insertQuery, {
                replacements: { payment_id, employer_id, employee_id },
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
