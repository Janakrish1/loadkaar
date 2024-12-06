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
db.models.Vehicle = require('./vehicles')(sequelize, Sequelize.DataTypes);
db.models.Payment = require('./employerPayment')(sequelize, Sequelize.DataTypes);
db.models.Review = require('./taskReviews')(sequelize, Sequelize.DataTypes);
db.models.UserLocation = require('./userLocation')(sequelize, Sequelize.DataTypes);
db.models.Warehouse = require('./warehouse')(sequelize, Sequelize.DataTypes);
db.models.WarehousePricing = require('./warehousePricing')(sequelize, Sequelize.DataTypes);
db.models.WarehouseLocation = require('./warehouseLocation')(sequelize, Sequelize.DataTypes);
db.models.Notification = require('./notification')(sequelize, Sequelize.DataTypes);

module.exports = db;