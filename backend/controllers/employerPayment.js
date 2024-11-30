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

    getPaymentDetails: async (req, res) => {
        const { user_id } = req.body; 
        console.log("asd", user_id);
        try {
            const selectQuery = `
                SELECT * 
                FROM Payment
                WHERE employer_id = :user_id;
            `;

            const paymentDetails = await sequelize.query(selectQuery, {
                replacements: { user_id },
                type: sequelize.QueryTypes.SELECT,
            });

            if (!paymentDetails && paymentDetails.length === 0) {
                return res.status(404).json({ message: 'No payment records found for this user.' });
            }

            res.status(200).json(paymentDetails);

        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching the payment details' });
        }
    }
};

