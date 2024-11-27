require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const db = require('./models')



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
const { registerUser, getUser, getUserID } = require("./controllers/user");
const { saveTaskDetails } = require("./controllers/employerTaskDetails");
const { saveTasks } = require("./controllers/employerTasks");
 
app.use("/api", dbRoute);

// Login & Register
app.use('/api/register', registerUser);
app.use('/api/login', getUser);

// User 
app.use('/api/get-user-id', getUserID); 

// Tasks
app.use('/api/save-tasks', saveTasks);

// Task Details
app.use('/api/saveTaskDetails', saveTaskDetails);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

