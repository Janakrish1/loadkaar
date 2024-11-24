require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const db = require('./models');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

(async() => {
    await db.sequelize.sync();
})();


// Routes
const postData = require("./routes/serverRoutes");
app.use("/api", postData);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));