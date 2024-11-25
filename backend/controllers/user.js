const {models:{User}} = require('../models/');
const { sequelize } = require('../models');
module.exports = {
    create: async (req, res) => {
        try{
        const email = String(req.body.email);
        const username = String(req.body.username);
        const password = String(req.body.password);

            // alternate way to insert into users table is the commented code below

            // await User.create({
            //     email, 
            //     username, 
            //     password
            // });

        const query = `INSERT INTO User (email, username, password, createdAt, updatedAt)
            VALUES (:email, :username, :password, NOW(), NOW())`;
        await sequelize.query(query, {
            replacements: { email, username, password },
            type: sequelize.QueryTypes.INSERT
        });
      
        // Send a success response
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        console.error('Error inserting user:', error);
        res.status(500).json({ error: 'An error occurred while inserting user' });
      }
    },

    validate: async (req, res) => {
        try {
        const email = String(req.body.email);
        const password = String(req.body.password);
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
          }
        const query = `SELECT * FROM User WHERE email = :email AND password = :password`;
        
        //const user = await User.findOne({ where: { email } });
        const [results] = await sequelize.query(query, {
            replacements: { email, password },
            type: sequelize.QueryTypes.SELECT
        });

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
          }
         res.status(200).json({ message: 'Login successful', results });
        }
        catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'An error occurred while fetching the user' });
        }
    }
}