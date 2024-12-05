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

            // Check if the necessary fields are provided
            if (!email || !password || !role) {
                return res.status(400).json({ error: 'Email, password, and role are required' });
            }

            // Step 1: Check if the user is already registered with the same email and role
            const findQuery = `
                SELECT COUNT(*) AS count
                FROM User
                WHERE email = :email AND role = :role
            `;

            const [results] = await sequelize.query(findQuery, {
                replacements: { email, role },
                type: sequelize.QueryTypes.SELECT
            });

            // If the user already exists, send an error message
            if (results.count > 0) {
                return res.status(400).json({ error: 'User already registered with this email and role. Please login.' });
            }

            // Step 2: If user does not exist, insert the new user into the database
            const insertQuery = `
                INSERT INTO User (
                    firstName, lastName, houseNo, locality, city, state, pincode, 
                    phoneNumber, email, password, role, createdAt, updatedAt
                )
                VALUES (
                    :firstName, :lastName, :houseNo, :locality, :city, :state, :pincode,
                    :phoneNumber, :email, :password, :role, NOW(), NOW()
                )
            `;

            await sequelize.query(insertQuery, {
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


            // Fetch the last inserted task_id using LAST_INSERT_ID()
            const [userIDResult] = await sequelize.query('SELECT LAST_INSERT_ID() AS user_id');

            // Extract the task_id from the result
            const userID = userIDResult[0].user_id;


            // Send a success response with the task ID
            res.status(201).json({
                message: 'User registered successfully.',
                userID: userID,
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while registering the user' });
        }
    },

    // Login and validate a user
    getUser: async (req, res) => {
        
        try {
            const { email, password, role } = req.body;
            console.log(email, password, role);
            if (!email || !password || !role) {
                return res.status(400).json({ error: 'Email, password, and role are required' });
            }

            const findUser = `
                SELECT user_id as userID
                from User
                WHERE email = :email AND password = :password AND role = :role
            `;

            const result = await sequelize.query(findUser, {
                replacements: { email, password, role },
                type: sequelize.QueryTypes.SELECT
            });

            if (!result || result.length === 0) {
                return res.status(400).json({ error: 'User not registered with this email and role. Please Register.' });
            }
            res.status(200).json({ message: 'Login successful', userID: result[0].userID });
        } catch (error) {
            console.error('Error logging in user:', error);
            res.status(500).json({ error: 'An error occurred while logging in the user' });
        }
    },

    getUserID: async (req, res) => {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Email, password, and role are required' });
        }

        try {
            const getUserIdQuery = `
                SELECT user_id AS userID
                FROM User
                WHERE email = :email AND password = :password AND role = :role;
            `;

            // Execute the query
            const [results] = await sequelize.query(getUserIdQuery, {
                replacements: { email, password, role },
                type: sequelize.QueryTypes.SELECT,
            });

            // Check if results are empty
            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Return the userID
            return res.status(200).json({ userID: results.userID });
        } catch (error) {
            console.error('Error fetching user ID:', error);
            return res.status(500).json({ error: 'An error occurred while fetching user ID' });
        }
    },

    getUserDetailsforPayment: async (req, res) => {
        const { userID } = req.body;

        if (!userID) {
            res.status(400).json({ error: "User not found" });
        }

        try {
            findQuery = `
                SELECT firstname AS FName, lastname AS LName, phoneNumber AS UserContact, email AS Email
                FROM User 
                WHERE user_id = :userID AND role = 'Employer'
            `;

            const [results] = await sequelize.query(findQuery, {
                replacements: { userID },
                type: sequelize.QueryTypes.SELECT,
            });

            if (results.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.status(200).json({ message: "User found succesfully!", FName: results.FName, LName: results.LName, UserContact: results.UserContact, Email: results.Email });

        } catch (error) {

        }
    },

    getProfileDetails: async (req, res) => {
        const { user_id } = req.body;
        if (!user_id) {
            res.status(400).json({ error: "User not found" });
        }

        try {
            findQuery = `
                SELECT *
                FROM User 
                WHERE user_id = :user_id
            `;

            const [results] = await sequelize.query(findQuery, {
                replacements: { user_id },
                type: sequelize.QueryTypes.SELECT,
            });

            if (results.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            res.status(200).json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateProfileDetails: async (req, res) => {
        const { 
            user_id,
            firstName,
            lastName,
            houseNo,
            locality,
            city,
            state,
            pincode,
            phoneNumber,
            email,
            password } = req.body;
        try {
            const updateQuery = `UPDATE User SET firstName = :firstName, lastName = :lastName, houseNo = :houseNo,
            locality = :locality, city = :city, state = :state, pincode = :pincode, phoneNumber = :phoneNumber,
            email = :email, password = :password WHERE user_id = :user_id`;

            // Update the vehicle status in the database
            const result = await sequelize.query(
                updateQuery,
                {
                    replacements: {
                        user_id,
                        firstName,
                        lastName,
                        houseNo,
                        locality,
                        city,
                        state,
                        pincode,
                        phoneNumber,
                        email,
                        password
                    },
                    type: sequelize.QueryTypes.UPDATE
                }
            );

            if (result.length === 0) {
                return res.status(404).json({ error: 'Vehicle not found' });
            }

            res.status(200).json({
                message: 'Vehicle status updated successfully',
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateUserStatus: async (req, res) => {
        const { 
            user_id,
            status} = req.body;
        try {
            const updateQuery = `UPDATE User SET status = :status WHERE user_id = :user_id`;

            // Update the vehicle status in the database
            const result = await sequelize.query(
                updateQuery,
                {
                    replacements: {
                        user_id,
                        status
                    },
                    type: sequelize.QueryTypes.UPDATE
                }
            );

            if (result.length === 0) {
                return res.status(404).json({ error: 'Vehicle not found' });
            }

            res.status(200).json({
                message: 'Vehicle status updated successfully',
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },


    checkActiveUser: async (req, res) => {
        const { user_id: user_id } = req.body;
        console.log(user_id);
        try {

            if (!user_id) {
                return res.status(400).json({ error: 'UserID is required' });
            }
            const findQuery = `
                SELECT COUNT(*) AS count
                FROM User
                WHERE user_id = :user_id AND status = 'Active'
            `;

            const [queryResult] = await sequelize.query(findQuery, {
                replacements: { user_id },
                type: sequelize.QueryTypes.SELECT
            });
            console.log(queryResult);
            if (queryResult.count === 0) {
                return res.status(200).json({ error: 'User is not in active state.' });
            }
            return res.status(200).json({ message: "The User is active", queryResult });
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    findDrivers: async (req, res) => {
        const { sourceLocation, vehicleType: vehicle_type } = req.body;

        try {
            if (!sourceLocation || !vehicle_type) {
                return res.status(400).json({ error: 'Location needed to find drivers.' });
            }

            const { lat, lng } = sourceLocation;

            const findQuery = `
                SELECT 
                    u.user_id AS user_id, 
                    u.firstName AS firstname, 
                    u.lastName AS lastname, 
                    l.latitude AS lat, 
                    l.longitude AS lng,
                    ROUND(
                        6371 * ACOS(
                            COS(RADIANS(:lat)) * COS(RADIANS(l.latitude)) *
                            COS(RADIANS(l.longitude) - RADIANS(:lng)) +
                            SIN(RADIANS(:lat)) * SIN(RADIANS(l.latitude))
                        )
                    ) AS distance_km,
                    ROUND(
                        6371 * ACOS(
                            COS(RADIANS(:lat)) * COS(RADIANS(l.latitude)) *
                            COS(RADIANS(l.longitude) - RADIANS(:lng)) +
                            SIN(RADIANS(:lat)) * SIN(RADIANS(l.latitude))
                        ) * v.benchmark_price
                    ) AS estimated_price
                FROM User u
                JOIN Location l ON u.user_id = l.user_id
                JOIN Vehicle v ON u.user_id = v.user_id
                WHERE u.role = 'Employee'
                AND u.status = 'Active'
                AND v.status = 'Active'
                AND v.vehicle_type = :vehicle_type
                HAVING distance_km <= 5;
            `;

            const results = await sequelize.query(findQuery, {
                replacements: { lat, lng, vehicle_type },
                type: sequelize.QueryTypes.SELECT,
            })

            res.status(200).json({message: 'Filtered drivers based around 5 kms', results});

        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateEmployeeStatus: async (req, res) => {
        const { 
            user_id,
            status,
            fromVehicleStatus,
            toVehicleStatus
        } = req.body;
    
        console.log(user_id, status, fromVehicleStatus, toVehicleStatus, "Employeee");
    
        // Validate input fields
        if (!user_id || !status || !fromVehicleStatus || !toVehicleStatus) {
            return res.status(400).json({ error: 'All fields are required to update the status.' });
        }
    
        try {
            // Update User status
            const updateQuery1 = `
                UPDATE User
                SET status = :status
                WHERE user_id = :user_id
            `;
    
            await sequelize.query(updateQuery1, {
                replacements: { status, user_id },
                type: sequelize.QueryTypes.UPDATE
            });
    
            // Update Vehicle status
            const updateQuery2 = `
                UPDATE Vehicle
                SET status = :toVehicleStatus
                WHERE user_id = :user_id
                AND status = :fromVehicleStatus
            `;
    
            const [updatedVehicleCount] = await sequelize.query(updateQuery2, {
                replacements: { toVehicleStatus, user_id, fromVehicleStatus },
                type: sequelize.QueryTypes.UPDATE
            });
    
            // Check if any vehicle record was updated
            if (updatedVehicleCount === 0) {
                return res.status(404).json({ error: 'No matching vehicle found to update.' });
            }
    
            // Respond with success
            return res.status(200).json({
                message: 'Employee and vehicle statuses updated successfully.'
            });
        } catch (error) {
            console.error('Error updating employee status:', error);
            return res.status(500).json({ error: 'An error occurred while updating the status.' });
        }
    },    
};
