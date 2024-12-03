const { sequelize } = require('../models'); // Import sequelize instance from models

module.exports = {  
    addWarehousePricing: async (req, res) => {
        const {
            warehouse_id,
            price_per_hour
        } = req.body;
        
        
        try {
            const insertQuery = `
                INSERT INTO WarehousePricing (
                    warehouse_id, price_per_hour, createdAt, updatedAt
                )
                VALUES (
                    :warehouse_id, :price_per_hour, NOW(), NOW()
                )
            `;


            await sequelize.query(
                insertQuery,
                {
                    replacements: {
                        warehouse_id,
                        price_per_hour
                    },
                    type: sequelize.QueryTypes.INSERT
                }
            );

            res.status(201).json({
                message: 'Warehouse Pricing added successfully',
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Update Warehouse Pricing
    updateWarehousePricing: async (req, res) => {
        const { warehouse_id,
            price_per_hour } = req.body;
        try {
            const updateQuery = `UPDATE WarehousePricing SET price_per_hour = ? WHERE warehouse_id = ?`;
            // Update the Warehouse Pricing in the database
            const result = await sequelize.query(
                updateQuery,
                {
                    replacements: {
                        price_per_hour,
                        warehouse_id
                    },
                    type: sequelize.QueryTypes.UPDATE
                }
            );

            if (result.length === 0) {
                return res.status(404).json({ error: 'Warehouse Pricing not found' });
            }

            res.status(200).json({
                message: 'Warehouse Pricing updated successfully',
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get Warehouse Pricing for a user
    getUserWarehousePricing: async (req, res) => {
        const { user_id } = req.body; // Get the user ID from request params
        try {
            const selectQuery = `SELECT * FROM Warehouse WHERE user_id = :user_id`;
            // Fetch the Warehouses of a user from the database
            const warehouse = await sequelize.query(
                selectQuery,
                {
                    replacements: {user_id},
                    type: sequelize.QueryTypes.SELECT
                }
            );

            if (warehouse.length === 0) {
                return res.status(200).json({ message: 'No warehouse found for this user' });
            }
            res.status(200).json(warehouse);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    };