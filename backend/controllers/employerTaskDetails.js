const { sequelize } = require('../models');

module.exports = {
    saveTaskDetails: async (req, res) => {
        try {
            const {
                vehicleType,
                itemDescription,
                pickupLocation,
                dropLocation,
                contactDetails
            } = req.body;


        } catch (error) {

        }
    },
};