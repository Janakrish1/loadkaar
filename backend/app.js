require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const sequelize = require("./config/db");



dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Test the database connection
sequelize.authenticate()
    .then(() => console.log("Database connected"))
    .catch((err) => console.log("Error: " + err));

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

