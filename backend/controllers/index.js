const controllers = {};

controllers.user = require('./user');
controllers.employerTasks = require('./employerTasks');
controllers.employerTaskDetails = require('./employerTaskDetails');
controllers.vehicles = require("./vehicles");

module.exports = controllers;