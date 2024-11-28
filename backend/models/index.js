const dbConfig = require('../config/db');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DATABASE, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT
});

const db = {};
db.sequelize = sequelize;
db.models = {};
db.models.User = require('./user')(sequelize, Sequelize.DataTypes);
db.models.Tasks = require('./employerTasks')(sequelize, Sequelize.DataTypes);
db.models.TaskDetails = require('./employerTaskDetails')(sequelize, Sequelize.DataTypes);
db.models.Payment = require('./employerPayment')(sequelize, Sequelize.DataTypes);

module.exports = db;