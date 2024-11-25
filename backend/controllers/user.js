const { sequelize } = require('../models');

module.exports = {
    // Register a new user
    registerUser: async (req, res) => {
        try {
            const {
                firstName,
                lastName,
                houseNo,
                locality,
                city,
                state,
                pincode,
                phoneNumber,
                email,
                password,
                role
            } = req.body;

            if (!email || !password || !role) {
                return res.status(400).json({ error: 'Email, password, and role are required' });
            }

            const query = `
                INSERT INTO User (
                    firstName, lastName, houseNo, locality, city, state, pincode, 
                    phoneNumber, email, password, role, createdAt, updatedAt
                )
                VALUES (
                    :firstName, :lastName, :houseNo, :locality, :city, :state, :pincode,
                    :phoneNumber, :email, :password, :role, NOW(), NOW()
                )
            `;

            await sequelize.query(query, {
                replacements: {
                    firstName,
                    lastName,
                    houseNo,
                    locality,
                    city,
                    state,
                    pincode,
                    phoneNumber,
                    email,
                    password,
                    role
                },
                type: sequelize.QueryTypes.INSERT
            });

            // Send a success response
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ error: 'An error occurred while registering the user' });
        }
    },

    // Login and validate a user
    getUser: async (req, res) => {
        try {
            const { email, password, role } = req.body;

            if (!email || !password || !role) {
                return res.status(400).json({ error: 'Email, password, and role are required' });
            }

            const query = `
                SELECT * 
                FROM User 
                WHERE email = :email AND password = :password AND role = :role
            `;

            const [results] = await sequelize.query(query, {
                replacements: { email, password, role },
                type: sequelize.QueryTypes.SELECT
            });

            if (results.length === 0) {
                return res.status(404).json({ error: 'Invalid credentials or user not found' });
            }

            res.status(200).json({ message: 'Login successful', user: results[0] });
        } catch (error) {
            console.error('Error logging in user:', error);
            res.status(500).json({ error: 'An error occurred while logging in the user' });
        }
    }
};
