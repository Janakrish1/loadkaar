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

    // added this fucntion  to retirve task id for payment.
    getTaskByPaymentId: async (req, res) => {
        const { payment_id } = req.body;

        if (!payment_id) {
            return res.status(400).json({ error: 'Payment ID is required' });
        }

        try {
            // Query to fetch task_id using payment_id
            const query = `
                SELECT task_id 
                FROM Tasks 
                WHERE payment_id = :payment_id;
            `;

            // Execute the query
            const [task] = await sequelize.query(query, {
                replacements: { payment_id },
                type: sequelize.QueryTypes.SELECT,
            });

            if (!task) {
                return res.status(404).json({ error: 'Task not found for the provided payment ID' });
            }

            // Send the response with the task ID
            res.status(200).json({
                message: 'Task retrieved successfully.',
                taskID: task.task_id,
            });
        } catch (error) {
            console.error(error);  // Log the error for debugging
            res.status(500).json({ error: 'An error occurred while fetching the task' });
        }
    }

};
