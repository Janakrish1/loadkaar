const { sequelize } = require("../models");

module.exports = {
    savePaymentSuccess: async (req, res) => {
        const { 
            paymentResponse: paymentResponse, 
            paymentData: paymentData,
            status: status
        } = req.body;

            // Payment Success: { razorpay_payment_id: 'pay_PQrg18rKcPMust' }
            // Delivery Form Data: {
            //   vehicleType: '2wheeler',
            //   itemDescription: 'df',
            //   pickupLocation: 'dfsdf',
            //   dropLocation: 'sdf',
            //   contactPerson: 'sdf',
            //   contactAddress: 'sdf',
            //   contactPhoneNumber: 'sdf'
            // }
            // User Details: { FName: 'test', LName: 'test', Email: 'test@gmail.com' }
            // Payment Data: {
            //   user_id: 1,
            //   employee_name: 'Driver A',
            //   employee_id: 1,
            //   amount: '12',
            //   payment_date: '2024-11-28'
            // }
            // status

        
        
        try {
            const insertQuery = `
                INSERT INTO Payment (payment_id, employer_id, employee_id, amount, status, payment_date, createdAt, updatedAt)
                VALUES (:payment_id, :employer_id, :employee_id, :amount, :status, :payment_date, NOW(), NOW());
            `;

            const { razorpay_payment_id: payment_id } = paymentResponse;
            const { user_id: employer_id, employee_id, amount, payment_date } = paymentData;

            await sequelize.query(insertQuery, {
                replacements: { payment_id, employer_id, employee_id, amount, status, payment_date },
                type: sequelize.QueryTypes.INSERT,
            });

            res.status(200).json({message: 'Payment details saved successfully!'});

        } catch (error) {
            res.status(500).json({ error: 'An error occurred while saving the payment details' });
        }   
    },
    employerGetPaymentDetails: async (req, res) => {
        const { payment_id } = req.body;
        if (!payment_id) {
            return res.status(400).json({ error: 'Payment is required' });
        }

        try {
            selectQuery = `
                SELECT *
                FROM Payment
                WHERE payment_id = :payment_id
            `;

            const results = await sequelize.query(selectQuery, {
                replacements: { payment_id },
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