const { sequelize } = require("../models");

module.exports = {
    saveTasks: async (req, res) => {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Email, password, and role are required' });
        }
        

    },
};