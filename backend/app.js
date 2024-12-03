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
const { saveTaskDetails, completeTask } = require("./controllers/employerTaskDetails");
const { saveTasks, getTasks, getTasksByPaymentIds } = require("./controllers/employerTasks");
const { registerUser, getUser, getProfileDetails, updateProfileDetails, checkActiveUser, findDrivers, getUserDetailsforPayment, updateUserStatus } = require("./controllers/user");
const { getUserVehicles, updateVehicleStatus, removeVehicle, addVehicle, getVehicleStatus } = require("./controllers/vehicles");
const { savePaymentSuccess, getPaymentDetails } = require("./controllers/employerPayment");
const { getReviewsByReviewerId, getReviewsByRevieweeId,insertReview } = require("./controllers/taskReviews");
const { storeEmployeeLocation } = require("./controllers/userLocation");
const { employeeTasks } = require("./controllers/employeeTasks");

app.use("/api", dbRoute);

// Login & Register
app.use('/api/register', registerUser);
app.use('/api/login', getUser);

// User 
app.use('/api/get-username', getUserDetailsforPayment);
app.use('/api/find-drivers', findDrivers);


// Tasks
app.use('/api/save-tasks', saveTasks);
app.use('/api/get-tasks', getTasks);
app.use('/api/employee-tasks', employeeTasks);
app.use('/api/get-taskbypayment', getTasksByPaymentIds);

// Task Details
app.use('/api/save-task-details', saveTaskDetails);
app.use('/api/complete-task', completeTask);

//Vehicles
app.use('/api/addVehicle', addVehicle);
app.use('/api/vehicles/user', getUserVehicles);
app.use('/api/vehicles/remove', removeVehicle);
app.use('/api/vehicles/update-status', updateVehicleStatus);
app.use('/api/vehicles/status', getVehicleStatus);

// Payment
app.use('/api/save-payment-details', savePaymentSuccess);
app.use('/api/get-payment-details', getPaymentDetails);

// reviews
app.use('/api/get-reviewbyreviewer', getReviewsByReviewerId);
app.use('/api/get-reviewbyreviewee', getReviewsByRevieweeId);
app.use('/api/insert-review',insertReview);


//Profile Settings
app.use('/api/user', getProfileDetails);
app.use('/api/updateProfile', updateProfileDetails);

//User Location 
app.use('/api/isactive', checkActiveUser);
app.use('/api/location', storeEmployeeLocation);
app.use('/api/users/updateStatus', updateUserStatus);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));