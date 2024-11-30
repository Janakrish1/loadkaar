require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const db = require('./models');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

/*
* Start server
* Test the database connection
*/

db.sequelize.authenticate()
    .then(() => console.log("Database connected"))
    .catch((err) => console.log("Error: " + err));

(async () => {
    await db.sequelize.sync();
})();

const dbRoute = require("./routes/connectDB");
const { saveTaskDetails, employerGetTaskDetails } = require("./controllers/employerTaskDetails");
const { saveTasks, employerGetTasks } = require("./controllers/employerTasks");
const { registerUser, getUser, getUserID, getUsername,getProfileDetails,updateProfileDetails, checkActiveUser } = require("./controllers/user");
const { getUserVehicles, updateVehicleStatus, removeVehicle, addVehicle, getVehicleStatus} = require("./controllers/vehicles");
const { savePaymentSuccess, employerGetPaymentDetails } = require("./controllers/employerPayment");
const { storeEmployeeLocation } = require("./controllers/userLocation");
 
app.use("/api", dbRoute);

// Login & Register
app.use('/api/register', registerUser);
app.use('/api/login', getUser);

// User 
app.use('/api/get-user-id', getUserID); 
app.use('/api/get-username', getUsername); 


// Tasks
app.use('/api/save-tasks', saveTasks);
app.use('/api/employer-get-tasks', employerGetTasks);

// Task Details
app.use('/api/save-task-details', saveTaskDetails);
app.use('/api/employer-get-task-details', employerGetTaskDetails);

//Vehicles
app.use('/api/addVehicle', addVehicle);
app.use('/api/vehicles/user', getUserVehicles);
app.use('/api/vehicles/remove', removeVehicle);
app.use('/api/vehicles/update-status', updateVehicleStatus);
app.use('/api/vehicles/status', getVehicleStatus);

// Payment
app.use('/api/save-payment-details', savePaymentSuccess);
app.use('/api/employer-get-payment-details', employerGetPaymentDetails);

// reviews


//Profile Settings
app.use('/api/user', getProfileDetails);
app.use('/api/updateProfile', updateProfileDetails);

//User Location 
app.use('/api/isactive', checkActiveUser);
app.use('/api/location',storeEmployeeLocation);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

