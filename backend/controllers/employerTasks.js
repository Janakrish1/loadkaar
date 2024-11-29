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

    // Updated function to retrieve task IDs for multiple payment IDs in one batch call
    getTasksByPaymentIds: async (req, res) => {
        const { payment_ids } = req.body;  // Expecting an array of payment_ids
    
        if (!Array.isArray(payment_ids) || payment_ids.length === 0) {
            return res.status(400).json({ error: 'A non-empty array of payment IDs is required' });
        }
    
        try {
            // Query to fetch task_ids using payment_ids
            const query = `
                SELECT payment_id, task_id
                FROM Tasks
                WHERE payment_id IN (:payment_ids);
            `;
    
            // Execute the query
            const tasks = await sequelize.query(query, {
                replacements: { payment_ids },
                type: sequelize.QueryTypes.SELECT,
            });
    
            if (tasks.length === 0) {
                return res.status(404).json({ error: 'No tasks found for the provided payment IDs' });
            }
    
            // Transform the result to map payment_id to its corresponding task_id
            const tasksMap = tasks.reduce((acc, task) => {
                acc[task.payment_id] = task.task_id;
                return acc;
            }, {});
    
            console.log("Tasks Map:", tasksMap);
    
            // Send the response with the tasks mapping
            res.status(200).json({
                message: 'Tasks retrieved successfully.',
                tasks: tasksMap,  // Map payment_id to task_id
            });
        } catch (error) {
            console.error(error);  // Log the error for debugging
            res.status(500).json({ error: 'An error occurred while fetching the tasks' });
        }
    }
    

};
