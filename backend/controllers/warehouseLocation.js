const { sequelize } = require('../models'); // Import sequelize instance from models

module.exports = {
    // Add a new warehouse
    addWarehouseLocation: async (req, res) => {
        const {
            warehouse_id,
            latitude,
            longitude,
            address
        } = req.body;
        
        
        try {
            const insertQuery = `
                INSERT INTO WarehouseLocation (
                    warehouse_id, latitude, longitude, address, createdAt, updatedAt
                )
                VALUES (
                    :warehouse_id, :latitude, :longitude, :address, NOW(), NOW()
                )
            `;


            await sequelize.query(
                insertQuery,
                {
                    replacements: {
                        warehouse_id,
                        latitude,
                        longitude,
                        address
                    },
                    type: sequelize.QueryTypes.INSERT
                }
            );

            res.status(201).json({
                message: 'Warehouse Location added successfully',
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Update Warehouse Location
    updateWarehouseLocation: async (req, res) => {
        const { warehouse_id,
            latitude,
            longitude,
            address } = req.body; // Vehicle ID and new status from the request body
        try {
            const updateQuery = `UPDATE WarehouseLocation SET latitude = ?, longitude = ?, address = ? WHERE warehouse_id = ?`;
            // Update the Warehouse Location in the database
            const result = await sequelize.query(
                updateQuery,
                {
                    replacements: {
                        latitude,
                        longitude,
                        address,
                        warehouse_id
                    },
                    type: sequelize.QueryTypes.UPDATE
                }
            );

            if (result.length === 0) {
                return res.status(404).json({ error: 'Warehouse Location not found' });
            }

            res.status(200).json({
                message: 'Warehouse Location updated successfully',
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get Warehouse Location for a user
    getUserWarehouseLocation: async (req, res) => {
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