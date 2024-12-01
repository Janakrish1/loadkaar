const { sequelize } = require("../models");

module.exports = {
    getReviewsByReviewerId: async (req, res) => {
        const { user_id: reviewer_id, role} = req.body; // Expecting reviewer_id from the request body
        console.log(reviewer_id);
        try {
            const selectQuery = `
                SELECT * FROM Review
                WHERE reviewer_id = :reviewer_id AND role LIKE :role ;
            `;

            const reviewDetails = await sequelize.query(selectQuery, {
                replacements: { reviewer_id, role },
                type: sequelize.QueryTypes.SELECT,
            });

            if (!reviewDetails && reviewDetails.length === 0) {
                return res.status(404).json({ message: 'No reviews found for this reviewer.' });
            }

            res.status(200).json(reviewDetails);

        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching reviews by reviewer_id' });
        }
    },

    getReviewsByRevieweeId: async (req, res) => {
        const { user_id: reviewee_id, role } = req.body; // Expecting reviewee_id from the request body

        try {
            const selectQuery = `
                SELECT * FROM Review
                WHERE reviewee_id = :reviewee_id AND role NOT LIKE :role ;
            `;

            const reviewDetails = await sequelize.query(selectQuery, {
                replacements: { reviewee_id, role },
                type: sequelize.QueryTypes.SELECT,
            });

            if (!reviewDetails && reviewDetails.length === 0) {
                return res.status(404).json({ message: 'No reviews found for this reviewee.' });
            }

            res.status(200).json(reviewDetails);

        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching reviews by reviewee_id' });
        }
    }
};