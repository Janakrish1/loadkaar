const { sequelize } = require("../models");
const { v4: uuidv4 } = require('uuid'); // For generating UUIDs
module.exports = {
    // Save new notification for a user
    saveNotification: async (req, res) => {
        const { user_id, message } = req.body;

        if (!user_id || !message) {
            return res.status(400).json({ error: 'User ID and message are required' });
        }

        try {
            // MySQL query to insert a new notification
            const insertQuery = `
                INSERT INTO Notification (notification_id, user_id, message, is_read, created_at)
                VALUES (:noti_id, :user_id, :message, false, NOW());
            `;

            const noti_id = uuidv4(); // Generate unique review_id
            // Execute the insert query
            await sequelize.query(insertQuery, {
                replacements: { noti_id,user_id, message },
                type: sequelize.QueryTypes.INSERT,
            });

            // Send a success response
            res.status(201).json({
                message: 'Notification saved successfully.',
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while saving the notification' });
        }
    },

    // Count the number of unread notifications for a user
    countUnreadNotifications: async (req, res) => {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            // MySQL query to count unread notifications
            const countQuery = `
                SELECT COUNT(*) AS count
                FROM Notification
                WHERE user_id = :user_id AND is_read = false;
            `;

            // Execute the count query
            const [result] = await sequelize.query(countQuery, {
                replacements: { user_id },
                type: sequelize.QueryTypes.SELECT,
            });

            res.status(200).json({
                message: 'Unread notifications count fetched successfully',
                count: result.count,
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while counting notifications' });
        }
    },

    // Fetch all notifications for a user
    getNotifications: async (req, res) => {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            // MySQL query to fetch all notifications for the user
            const selectQuery = `
                SELECT notification_id, user_id, message, is_read, created_at
                FROM Notification
                WHERE user_id = :user_id
                ORDER BY created_at DESC;
            `;

            // Execute the select query
            const notifications = await sequelize.query(selectQuery, {
                replacements: { user_id },
                type: sequelize.QueryTypes.SELECT,
            });

            if (notifications.length === 0) {
                return res.status(200).json({ message: 'No notifications found for this user.', notifications: [] });
            }

            res.status(200).json({
                message: 'Notifications fetched successfully.',
                notifications,
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching notifications' });
        }
    },

    // Mark a notification as read
    markNotificationAsRead: async (req, res) => {
        const { notification_id } = req.body;

        if (!notification_id) {
            return res.status(400).json({ error: 'Notification ID is required' });
        }

        try {
            // MySQL query to find and update the notification's read status
            const updateQuery = `
                UPDATE Notification
                SET is_read = true
                WHERE notification_id = :notification_id;
            `;

            // Execute the update query
            const [affectedRows] = await sequelize.query(updateQuery, {
                replacements: { notification_id },
                type: sequelize.QueryTypes.UPDATE,
            });

            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Notification not found' });
            }

            res.status(200).json({
                message: 'Notification marked as read successfully.',
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while updating the notification' });
        }
    },
};
