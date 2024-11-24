// const sequelize = require("../config/db");
const express = require("express");
// const mysql = require("mysql");
const cors = require('cors');
const {user} = require('../controllers')

const app = express.Router();
// app.use(cors);
app.use(express.json());

app.post('/signup', user.create);
app.get('/login', user.validate);

// app.get('/signup', async (req, res) => {
//     try {
//         // Correct SQL syntax, remove single quotes from column names
//         const sql = "INSERT INTO login (username, email, password) VALUES (?, ?, ?)";
//         const values = [
//             req.body.username,
//             req.body.email,
//             req.body.password
//         ];
//         const sequelize = new Sequelize(
//             process.env.DB_NAME,
//             process.env.DB_USER,
//             process.env.DB_PASSWORD,
//             {
//                 host: process.env.DB_HOST,
//                 dialect: "mysql",
//             }
//         );
//         // Use sequelize.query() correctly with replacements
//         const [result, metadata] = await sequelize.query(sql, {
//             replacements: values, // Use replacements to safely inject values
//             type: Sequelize.QueryTypes.INSERT // Specify the type of query
//         });

//         // Send a success response
//         res.json({ message: "User signed up successfully", result });
//     } catch (error) {
//         console.error("Error inserting data:", error);
//         // Return an error response if the query fails
//         res.status(500).json({ error: "Failed to sign up user" });
//     }
// });


// app.get(process.env.DB_NAME, (req,res) => {
//     const sql = "SELECT * FROM login WHERE 'email' = ? AND 'password' = ?";
//     const values = [
//         req.body.email,
//         req.body.password
//     ]
//     sequelize.query(sql, [values], (err, data) => {
//         if(err)
//         {
//             return res.json("Error");
//         }
//         if(data.length > 0)
//         {
//             return res.json("Success");
//         }
//         else{
//             return res.json("Failure");
//         }
//     })
// })


module.exports = app;